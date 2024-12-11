<script lang="ts" setup>
import VTabbar from '@/components/VTabbar/index.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const currentTab = ref<'home' | 'article' | 'video' | 'optimize' | 'my'>('video')
const webviewUrl = ref('')

onLoad((options) => {
  const { type = 'video' } = options
  currentTab.value = type as typeof currentTab.value

  // 根据类型设置不同的webview URL
  webviewUrl.value = type === 'video'
    ? 'https://your-video-url.com'
    : 'https://your-optimize-url.com'
})
</script>

<template>
  <NavBar :title="currentTab === 'video' ? '视频' : '优化'" />

  <web-view :src="webviewUrl" />

  <VTabbar
    :value="currentTab"
    fixed
    safe-area-inset-bottom
    placeholder
  />
</template>

<route lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>
