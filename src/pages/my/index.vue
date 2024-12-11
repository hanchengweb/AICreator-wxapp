<script lang="ts" setup>
import { uniNav } from '@/utils'

function toLogin() {
  uniNav.navigateTo('/pages/login/login')
}
</script>

<template>
  <NavBar title="我的" />

  <div class="center flex-col pt-4">
    <div class="p-4 rounded-full bg-[#ffd8cb]">
      <div class="i-carbon:user w-8 h-8 color-[#FF5631]" />
    </div>

    <div class="pt-3 text-lg font-bold">
      13900000001
    </div>
  </div>

  <div class="px-4 pt-8">
    <WdCellGroup custom-class="rounded-lg overflow-hidden" border>
      <WdCell title="退出登录" is-link @click="toLogin">
        <template #icon>
          <div>
            <div class="i-carbon:logout w-[16px] h-[16px] pr-3 color-primary" />
          </div>
        </template>
      </WdCell>
    </WdCellGroup>
  </div>

  <VTabbar value="my" />
</template>

<route lang="yaml">
  style:
    navigationBarTitleText: ""
    navigationStyle: "custom"
  </route>

<!-- <style lang="scss" scoped></style> -->
