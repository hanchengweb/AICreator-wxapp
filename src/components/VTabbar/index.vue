<script lang="ts" setup>
import { uniNav } from '@/utils'

const props = withDefaults(defineProps<{
  value: 'home' | 'article' | 'video' | 'optimize' | 'my'
  fixed: boolean
  safeAreaInsetBottom: boolean
  placeholder: boolean
}>(), {
  fixed: false,
  safeAreaInsetBottom: false,
  placeholder: false,
})

const tabs = {
  home: '/pages/home/home',
  article: '/pages/index/index',
  video: '/pages/video/index',
  optimize: '/pages/optimize/index',
  my: '/pages/my/index',
}

function onChange({ value }) {
  if (props.value === value)
    return

  const url = tabs[value]
  if (!url)
    return

  uniNav.reLaunch(url)
}
</script>

<template>
  <WdTabbar :model-value="value" fixed safe-area-inset-bottom placeholder @change="onChange">
    <WdTabbarItem title="首页" name="home" icon="home" />
    <WdTabbarItem title="图文" name="article" icon="edit" />
    <WdTabbarItem title="视频" name="video" icon="video" />
    <WdTabbarItem title="优化" name="optimize" icon="chart" />
    <WdTabbarItem title="我的" name="my" icon="user" />
  </WdTabbar>
</template>

<!-- <style lang="scss" scoped></style> -->
