<script lang="ts" setup>
import { IconReload } from '@/static'
import dayjs from 'dayjs'

import { isString } from 'lodash-es'
import { computed, reactive, watchEffect } from 'vue'
import { sendSms, sendSmsCheck, type SendSmsData } from './api'

interface Props {
  modelValue: boolean
  phone?: string
}

interface Emits {
  (event: 'success'): void
  (event: 'update:modelValue', show: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  phone: '',
})

const emits = defineEmits<Emits>()

const INIT_FUTU_X = 0

const show = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val),
})

const data = reactive({
  zhutuPic: '', // 主图
  // 缺口图
  futuPic: '',
  loaded: false,
  futu_x: INIT_FUTU_X, // 默认的位置
  futu_anxiaX: undefined, // 按下时，手指的位置
  futu_doudongClass: false,
  captchaStatus: '', // success | error
  captchaId: '',
  msgLoadMsg: '加载中...',
})

const captchaTrack = reactive<Recordable>({
  bgImageHeight: uni.upx2px(366),
  bgImageWidth: uni.upx2px(600),
  sliderImageHeight: -1,
  sliderImageWidth: -1,
  startSlidingTime: '',
  endSlidingTime: '',
  trackList: [],
})

function resetCaptchaTrack() {
  // 停止抖动
  data.futu_doudongClass = false
  // 回到默认的位置
  data.futu_x = INIT_FUTU_X
  // 清空轨迹
  captchaTrack.sliderImageHeight = -1
  captchaTrack.sliderImageWidth = -1
  captchaTrack.startSlidingTime = ''
  captchaTrack.endSlidingTime = ''
  captchaTrack.trackList = []
}

async function shuaxin() {
  data.futu_x = INIT_FUTU_X
  data.zhutuPic = ''
  data.futuPic = ''
  data.captchaStatus = ''
  data.msgLoadMsg = '加载中...'
  data.loaded = false

  try {
    const res = await sendSmsCheck()

    const { data: _data } = res

    if (_data.status !== 200) {
      // 错误处理
      setTimeout(() => {
        if (isString(_data.msg)) {
          data.msgLoadMsg = _data.msg
          data.loaded = false
        }
      }, 300)
    }

    // 生成验证码成功
    data.futuPic = _data.data.captcha.sliderImage
    data.zhutuPic = _data.data.captcha.backgroundImage
    data.captchaId = _data.data.id
    data.loaded = true
  }
  catch (err: any) {
    if (err.errMsg === 'request:fail timeout') {
      data.msgLoadMsg = '请求超时请重试'
    }

    console.log('err :>> ', err)
    data.loaded = false
  }
}

function touchstart(event: Recordable) {
  // 手指按下
  if (data.loaded && data.futu_anxiaX === undefined && data.futu_x === INIT_FUTU_X) {
    captchaTrack.startSlidingTime = new Date()
    captchaTrack.trackList.push({
      x: data.futu_x,
      y: 0,
      type: 'down',
      t: new Date().getTime() - captchaTrack.startSlidingTime.getTime(),
    })
    data.futu_anxiaX = event.touches[0].clientX
  }
}

function touchmove(event: Recordable) {
  // 手指移动
  if (data.loaded && data.futu_anxiaX !== undefined) {
    const x = INIT_FUTU_X + (event.touches[0].clientX - data.futu_anxiaX)
    console.log('x :>> ', x, event.touches[0].clientX)
    const [min, max] = [0, uni.upx2px(600 - 79)] // 确保不会超出边界【600是父元素的宽度、79是自身元素的宽度】
    data.futu_x = x < min ? min : x > max ? max : x

    captchaTrack.trackList.push({
      x: data.futu_x,
      // x: parseInt(this.futu_x * (679 / uni.upx2px(600))),
      y: 0,
      type: 'move',
      t: new Date().getTime() - captchaTrack.startSlidingTime.getTime(),
    })
  }
}

async function touchend(event: Recordable) {
  // 手指离开
  if (data.loaded && data.futu_anxiaX !== undefined) {
    data.futu_anxiaX = undefined
    if (data.zhutuPic === '') {
      data.futu_x = INIT_FUTU_X
    }
    else {
      captchaTrack.endSlidingTime = new Date()
      captchaTrack.trackList.push({
        x: data.futu_x,
        // x: parseInt(this.futu_x * (679 / uni.upx2px(600))),
        y: 0,
        type: 'up',
        t: new Date().getTime() - captchaTrack.startSlidingTime.getTime(),
      })

      try {
        const res = await sendSms({
          captchaTrack: {
            ...captchaTrack,
            endSlidingTime: dayjs(captchaTrack.endSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
            startSlidingTime: dayjs(captchaTrack.startSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
          } as SendSmsData['captchaTrack'],
          id: data.captchaId,
          form: {
            phone: props.phone,
          },
        })

        if (res.data.status === 200) {
          data.captchaStatus = 'success'
          setTimeout(() => {
            show.value = false
            emits('success')
          }, 1.5 * 1000)

          return
        }

        res.data.msg && uni.showToast({ title: res.data.msg, icon: 'none' })
        // 启动抖动动画
        data.futu_doudongClass = true // 执行抖动的css动画
        data.captchaStatus = 'error'
        // 等待抖动结束
        setTimeout(() => {
          resetCaptchaTrack()
          // 重载
          shuaxin()
        }, 700)
      }
      catch (error) {
        uni.showToast({ title: '发送验证码失败请重试', icon: 'none' })
        // 启动抖动动画
        data.futu_doudongClass = true // 执行抖动的css动画
        data.captchaStatus = 'error'
        // 等待抖动结束
        setTimeout(() => {
          resetCaptchaTrack()
          // 重载
          shuaxin()
        }, 700)
      }
    }
  }
}

watchEffect(() => {
  if (props.modelValue) {
    shuaxin()
  }
})
</script>

<template>
  <view>
    <view v-if="show" class="slider-verifiy" @mousemove="touchmove" @mouseup="touchend">
      <view class="slider-verifiy__body">
        <view class="slider-verifiy__header">
          <view class="slider-verifiy__header-title">
            拖动下方滑块完成拼图
          </view>

          <view class="slider-verifiy__header-close" @click="show = false" />
        </view>

        <view class="slider-verifiy__movable">
          <view v-if="data.zhutuPic === ''" class="slider-verifiy__movable-tip">
            {{ data.msgLoadMsg }}
          </view>

          <image v-else class="slider-verifiy__movable-bg" :src="data.zhutuPic" mode="widthFix" />

          <view
            class="slider-verifiy__movable-jigsaw"
            :class="[{ tremble: data.futu_doudongClass }]"
            :style="{
              backgroundImage: `url(${data.futuPic})`,
              left: `${data.futu_x}px`,
            }"
          />
        </view>

        <view class="slider-verifiy__slide">
          <view
            class="slider-verifiy__slide-filling"
            :class="data.captchaStatus"
            :style="{ width: `${data.futu_x}px` }"
          />

          <view
            class="slider-verifiy__slide-thumb"
            :class="data.captchaStatus"
            :style="{ left: `${data.futu_x}px` }"
            @touchstart="touchstart"
            @touchmove="touchmove"
            @touchend="touchend"
            @mousedown="touchstart"
          />
        </view>

        <view class="slider-verifiy__footer">
          <view class="slider-verifiy__footer-refresh" @click="shuaxin">
            <image class="slider-verifiy__footer-refresh__icon" :src="IconReload" />
            刷新
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
$prefix: slider-verifiy;

.#{$prefix} {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 30%);

  &__body {
    width: 600rpx;
    padding: 30rpx;
    background: #fff;
    border-radius: 16rpx;

    .#{$prefix}__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 20rpx;

      &-title {
        font-size: 30rpx;
        line-height: 42rpx;
        color: #333;
      }

      &-close {
        position: relative;
        display: inline-block;

        @include close-icon();
      }
    }

    .#{$prefix}__movable {
      position: relative;
      flex-direction: column;
      width: 100%;

      &-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 30rpx;
        line-height: 366rpx;
        color: #999;
        background: #f8f8f8;
      }

      &-bg {
        display: block;
        width: 600rpx;
        height: 366rpx;
      }

      &-jigsaw {
        position: absolute;
        top: 0;
        left: 0;
        width: 112rpx;
        height: 100%;
        background-repeat: no-repeat;
        background-size: 100%;

        @keyframes tremble {
          20% {
            transform: translateX(-15px);
          }

          40% {
            transform: translateX(15px);
          }

          60% {
            transform: translateX(-15px);
          }

          80% {
            transform: translateX(15px);
          }

          100% {
            transform: translateX(0);
          }
        }

        &.tremble {
          animation: tremble 500ms linear 1;
        }
      }
    }

    .#{$prefix}__slide {
      position: relative;
      width: 100%;
      height: 64rpx;
      margin-top: 8rpx;
      margin-bottom: 23rpx;
      overflow: hidden;
      background: #f2f3f5;
      border-radius: 8rpx;

      $progress: #1890ff;
      $success: #52c41a;
      $error: #ff4d4f;

      &-filling {
        box-sizing: border-box;
        height: 100%;
        background-color: #fff;
        background-color: $progress;

        &.success {
          background-color: $success;
        }

        &.error {
          background-color: $error;
        }
      }

      &-thumb {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 94rpx;
        height: 100%;
        background-color: #fff;
        border: 4rpx solid #f2f3f5;

        &.success {
          background-color: $success;
          border-color: $success;
        }

        &.error {
          background-color: $error;
          border-color: $error;
        }
      }
    }

    .#{$prefix}__footer {
      display: flex;
      justify-content: flex-end;

      &-refresh {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        line-height: 31px;
        color: #333;

        &__icon {
          width: 30rpx;
          height: 30rpx;
          margin-right: 12rpx;
        }
      }
    }
  }
}
</style>
