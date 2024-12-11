<script lang="ts" setup>
import VTabbar from '@/components/VTabbar/index.vue'

const currentTab = ref<'home' | 'article' | 'video' | 'optimize' | 'my'>('article')
</script>

<template>
  <NavBar title="图文" />

  <view class="content">
    <text>图文页面</text>
  </view>

  <VTabbar value="article" fixed safe-area-inset-bottom placeholder />
</template>

<style lang="scss" scoped>
.content {
  padding: 20rpx;
}
</style>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>
