<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable-next-line selector-type-no-unknown */
:root, page {
  --wot-color-theme: #165dff;
  --wot-button-large-radius: 8rpx;
  --wot-button-plain-bg-color: rgba(#fff, 0%);
  --wot-button-success-bg-color: #00b42a;

  height: 100%;

  // #ifndef H5
  background-color: #f2f3f5;
  // #endif
}

html {
  background-color: #f2f3f5;
}

// 全局覆盖修改 message-box 样式
.wd-message-box {
  .wd-button {
    border-radius: 12rpx !important;

    // &[class~="is-info"] {
    //   color: #fa5f2a !important;
    //   background: #fff0eb !important;
    // }
  }
}
</style>
