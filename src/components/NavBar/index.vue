<script lang="ts" setup>
import { isBoolean, isFunction } from 'lodash-es'
import { computed, type CSSProperties } from 'vue'
import { unref } from 'vue'

import { useNavBarHeight } from './useNavBarHeight'

interface Props {
  fixed?: boolean
  bgColor?: string
  title?: string
  back: boolean | 'auto' | (() => boolean | 'auto')
  onBack?: () => void
  block: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fixed: true,
  bgColor: 'transparent',
  title: '',
  back: 'auto',
  block: true,
  onBack: undefined,
})

const { statusBarHeight, navBarHeight, mainHeight } = useNavBarHeight()

const hasBack = computed(() => {
  if (isBoolean(props.back))
    return props.back

  if (props.back === 'auto') {
    // 自动计算是否可以回到上一级
    const pages = getCurrentPages()
    return pages.length > 1
  }

  return false
})

const mainStyle = computed<CSSProperties>(() => {
  const _styles: CSSProperties = {}

  if (props.fixed) {
    _styles.position = 'fixed'
  }

  _styles.backgroundColor = props.bgColor

  return _styles
})

const statusStyles = computed<CSSProperties>(() => {
  return {
    height: `${unref(statusBarHeight)}px`,
  }
})

const navBarStyles = computed<CSSProperties>(() => {
  const { height, minHeight, lineHeight, paddingTop, paddingBottom, paddingLeft } = unref(navBarHeight)

  const _styles: CSSProperties = {
    // 导航栏高度
    height: `${height}px`,
    minHeight: `${minHeight}px`,
    lineHeight: `${lineHeight}px`,
    // 导航栏距离顶部距离
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    // 胶囊距右方间距（方保持左、右间距一致）
    paddingLeft: `${paddingLeft}px`,
  }

  return _styles
})

const blockStyles = computed<CSSProperties>(() => {
  const _styles: CSSProperties = {
    // 导航栏高度
    height: `${unref(mainHeight)}px`,
  }

  return _styles
})

function gotoBack() {
  if (isFunction(props.onBack)) {
    props.onBack()
    return
  }

  const pages = getCurrentPages()

  const isIndex = pages.length <= 1

  if (isIndex && props.back === true) {
    uni.reLaunch({ url: '/pages/home/home' })
    return
  }

  if (isIndex) {
    return
  }

  uni.navigateBack()
}
</script>

<template>
  <view class="nav-bar" :style="mainStyle">
    <view class="nav-bar__status" :style="statusStyles" />

    <view class="nav-bar__content" :style="navBarStyles">
      <view v-if="hasBack" class="nav-bar__content__back" @click="gotoBack" />

      <slot name="title">
        <view class="nav-bar__content__title">
          {{ title }}
        </view>
      </slot>
    </view>
  </view>

  <view v-if="block && fixed" class="nav-bar__block" :style="blockStyles">
    <!-- 空占位 -->
  </view>
</template>

<style lang="scss" scoped>
$prefix: nav-bar;

@mixin back($color: #000000, $size: 20rpx) {
  width: 40rpx;
  height: 40rpx;

  &::after {
    position: absolute;
    top: 50%;
    left: 20rpx;
    width: $size;
    height: $size;
    content: '';
    border-top: 2px solid $color;
    border-left: 2px solid $color;
    transform: translate(0, -50%) rotate(-45deg);
  }
}

.#{$prefix} {
  z-index: 999;
  width: 100%;

  &__content {
    position: relative;

    &__back {
      position: absolute;
      top: 50%;
      left: 20rpx;
      transform: translateY(-50%);

      @include back();
    }

    &__title {
      font-size: 32rpx;
      font-weight: 500;
      color: #000;
      text-align: center;
    }
  }
}

// .#{$prefix} {}
</style>
