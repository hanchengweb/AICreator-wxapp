<script lang="ts" setup>
import VTabbar from '@/components/VTabbar/index.vue'
import { ref } from 'vue'

const currentTab = ref<'home' | 'article' | 'video' | 'optimize' | 'my'>('optimize')
</script>

<template>
  <NavBar title="优化" />

  <view class="optimize-container">
    <view class="section">
      <text class="section-title">
        性能优化
      </text>
      <view class="card-list">
        <view class="card">
          <text class="card-title">
            加载性能
          </text>
          <text class="card-desc">
            首屏加载时间优化建议
          </text>
        </view>
        <view class="card">
          <text class="card-title">
            运行性能
          </text>
          <text class="card-desc">
            运行时性能优化方案
          </text>
        </view>
      </view>
    </view>
  </view>

  <VTabbar value="optimize" fixed safe-area-inset-bottom placeholder />
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.optimize-container {
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

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.card {
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgb(0 0 0 / 5%);
}

.card-title {
  margin-bottom: 8rpx;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  line-height: $line-height-tight;
  color: var(--wot-text-color);
}

.card-desc {
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
