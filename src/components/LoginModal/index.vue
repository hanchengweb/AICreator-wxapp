<script lang="ts" setup>
import { ref, watch } from 'vue'

import { useWechatLogin } from './useWechatLogin'

interface Props {
  modelValue?: boolean
}

interface Emits {
  (event: 'update:modelValue', bool: boolean): void
  (event: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emits = defineEmits<Emits>()

const isShow = ref(props.modelValue) // 是否显示

watch(
  () => props.modelValue,
  (val) => {
    isShow.value = val
  },
)

watch(isShow, (val) => {
  emits('update:modelValue', val)
})

const { selected, getPhoneNumber } = useWechatLogin((token) => {
  if (!token)
    return
  isShow.value = false
  emits('success')
})

function goToSmsLogin() {
  uni.navigateTo({ url: '/pages/login/sms?type=back' })
}
</script>

<template>
  <view v-if="isShow" class="login-modal">
    <view class="login-modal__content">
      <view class="login-modal__content-title">
        登录
      </view>

      <button
        v-show="selected"
        class="login-modal__content-btn wechat"
        hover-class="active"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号快捷登录
      </button>

      <button
        v-show="!selected"
        class="login-modal__content-btn wechat"
        hover-class="active"
        @click="getPhoneNumber"
      >
        手机号快捷登录
      </button>

      <button class="login-modal__content-btn phone" hover-class="active" @click="goToSmsLogin">
        短信验证码登录
      </button>

      <!-- 勾选协议 -->
      <!-- <view class="login-modal__content__privacy-agreement" @click="toggleSelected">
        <label class="login-modal__content__privacy-agreement--radio">
        <radio :checked="selected" />

        <view>
        我已阅读并同意
        <view class="login-modal__content__privacy-agreement__btn" @click.stop="navigateToURL(0)">
        《用户协议》
        </view>

        <view class="login-modal__content__privacy-agreement__btn" @click.stop="navigateToURL(1)">
        《隐私条款》
        </view>
        </view>
        </label>
        </view> -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);

  &__content {
    width: 580rpx;
    padding: 50rpx 30rpx;
    background-color: #fff;
    border-radius: 8rpx;

    &-title {
      margin-bottom: 50rpx;
      font-size: 36rpx;
      font-weight: 600;
      text-align: center;
    }

    &-btn {
      width: 100%;

      &.wechat {
        @include button();
      }

      &.phone {
        margin-top: 30rpx;

        @include button(90rpx, $uni-color-primary, true);
      }
    }

    &__privacy-agreement {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 50rpx;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 28rpx;
      color: #333;
      text-align: center;

      &--radio {
        display: flex;
        align-items: center;

        & > view {
          display: flex;
          white-space: nowrap;
        }
      }

      &__btn {
        color: $uni-color-primary;
      }
    }
  }
}
</style>
