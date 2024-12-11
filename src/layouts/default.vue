<script setup lang="ts">
import { useNavBarHeight } from '@/components/NavBar/useNavBarHeight'
import { setNotifyDefaultOptions } from 'wot-design-uni'

const { mainHeight } = useNavBarHeight()

onMounted(() => {
  setNotifyDefaultOptions({
    safeHeight: mainHeight.value,
  })
})
</script>

<template>
  <slot />

  <WdToast />
  <WdMessageBox />
  <WdNotify />
</template>
