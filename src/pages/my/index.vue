<script lang="ts" setup>
import { uniNav } from '@/utils'

function toLogin() {
  uniNav.navigateTo('/pages/login/login')
}
</script>

<template>
  <view class="page-container relative">
    <NavBar title="我的" />

    <view class="main-content">
      <view class="center flex-col pt-4">
        <view class="p-4 rounded-full bg-[#ffd8cb]">
          <view class="i-carbon:user w-8 h-8 color-[#FF5631]" />
        </view>

        <view class="pt-3 text-lg font-bold">
          13900000001
        </view>
      </view>

      <view class="px-4 pt-8">
        <WdCellGroup custom-class="rounded-lg overflow-hidden" border>
          <WdCell title="退出登录" is-link @click="toLogin">
            <template #icon>
              <view>
                <view class="i-carbon:logout w-[16px] h-[16px] pr-3 color-primary" />
              </view>
            </template>
          </WdCell>
        </WdCellGroup>
      </view>
    </view>

    <VTabbar value="my" />
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;

  :deep(.uni-data-select) {
    position: relative;
    z-index: 1;
  }
}

.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
  overflow-y: auto;
}
</style>

<route lang="yaml">
  style:
    navigationBarTitleText: ""
    navigationStyle: "custom"
</route>
