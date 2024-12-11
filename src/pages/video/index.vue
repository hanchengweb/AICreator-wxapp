<script lang="ts" setup>
import VTabbar from '@/components/VTabbar/index.vue'
import { ref } from 'vue'

const currentTab = ref<'home' | 'article' | 'video' | 'optimize' | 'my'>('video')
</script>

<template>
  <NavBar title="视频" />

  <view class="video-container">
    <view class="section">
      <text class="section-title">
        推荐视频
      </text>
      <view class="video-list">
        <view class="video-item">
          <view class="video-cover" />
          <view class="video-info">
            <text class="video-title">
              视频标题
            </text>
            <text class="video-desc">
              视频描述信息
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>

  <VTabbar value="video" fixed safe-area-inset-bottom placeholder />
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.video-container {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20rpx;
  font-family: $font-family-base;
  background-color: var(--wot-white);
}

.section {
  margin-bottom: 32rpx;
}

.section-title {
  margin-bottom: 24rpx;
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
  line-height: $line-height-tight;
  color: var(--wot-text-color);
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.video-item {
  overflow: hidden;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgb(0 0 0 / 5%);
}

.video-cover {
  height: 320rpx;
  background: #f5f5f5;
}

.video-info {
  padding: 20rpx;
}

.video-title {
  margin-bottom: 8rpx;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  line-height: $line-height-tight;
  color: var(--wot-text-color);
}

.video-desc {
  font-size: $font-size-sm;
  line-height: $line-height-base;
  color: var(--wot-text-color-secondary);
}
</style>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>
