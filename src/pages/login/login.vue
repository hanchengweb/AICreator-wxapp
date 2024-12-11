<script lang="ts" setup>
import { useWechatLogin } from '@/components/LoginModal/useWechatLogin'

import NavBar from '@/components/NavBar/index.vue'
import { ImgBg, ImgLogo } from '@/static'
import { uniNav } from '@/utils/uniNav'
import { onLoad } from '@dcloudio/uni-app'

// const APP_NAME = import.meta.env.VITE_APP_NAME

onShareAppMessage(options => onGlobalShare(options))
const { reLaunchUrl, selected, getPhoneNumber } = useWechatLogin()

onLoad((query) => {
  reLaunchUrl.value = decodeURIComponent(query?.redirect || '')
})

function goToSmsLogin() {
  uniNav.navigateTo('/pages/login/sms', {
    redirect: encodeURIComponent(reLaunchUrl.value || ''),
  })
}
</script>

<template>
  <NavBar :block="false" />

  <view class="login">
    <view class="login-content">
      <image :src="ImgLogo" class="login-content__logo" />

      <!-- <view class="login-content__title">{{ APP_NAME }}</view> -->

      <button
        v-show="selected"
        class="login-content__btn wechat"
        hover-class="active"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        手机号快捷登录
      </button>

      <button
        v-show="!selected"
        class="login-content__btn wechat"
        hover-class="active"
        @click="getPhoneNumber"
      >
        手机号快捷登录
      </button>

      <button class="login-content__btn phone" hover-class="active" @click="goToSmsLogin">
        短信验证码登录
      </button>
    </view>

    <!-- 勾选协议 -->
    <!-- <view class="login__privacy-agreement" @click="toggleSelected">
      <label class="login__privacy-agreement--radio">
      <radio :checked="selected" />

      <view>
      我已阅读并同意
      <view class="login__privacy-agreement__btn" @click.stop="navigateToURL(0)">《用户协议》</view>

      <view class="login__privacy-agreement__btn" @click.stop="navigateToURL(1)">《隐私条款》</view>
      </view>
      </label>
      </view> -->

    <!-- 背景 -->
    <image class="login__background" :src="ImgBg" />
  </view>
</template>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>

<style lang="scss">
/* radio 样式修改 */
/* stylelint-disable-next-line selector-type-no-unknown */
radio {
  @include custom-radio();
}
</style>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100%;
  padding: 0 30rpx;

  &__background {
    z-index: -1;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 10rpx;

    @include abs-fill-screen();
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__logo {
      width: 160rpx;
      height: 160rpx;
      padding-top: 540rpx;
      padding-bottom: 122rpx;
      border-radius: 50%;
    }

    &__title {
      padding-top: 20rpx;
      margin-bottom: 100rpx;
      font-size: 36rpx;
      font-weight: 600;
    }

    &__btn {
      width: 100%;

      &.wechat {
        @include button();
      }

      &.phone {
        margin-top: 50rpx;

        @include button(90rpx, $uni-color-primary, true);
      }
    }
  }

  &__privacy-agreement {
    position: fixed;
    right: 0;
    bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
    bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 30rpx auto;
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
      }
    }

    &__btn {
      color: $uni-color-primary;
    }
  }
}
</style>
