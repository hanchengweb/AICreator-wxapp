<script lang="ts" setup>
import VTabbar from '@/components/VTabbar/index.vue'
import { ref } from 'vue'
import { useMessage, useNotify, useToast } from 'wot-design-uni'

const toast = useToast()
const message = useMessage()
const { showNotify } = useNotify()

const count = ref(0)
const currentTab = ref<'home' | 'article' | 'video' | 'optimize' | 'my'>('home')

function setCountPlus() {
  count.value = count.value + 1
}

function onUseToast() {
  setCountPlus()

  toast.show(`Hello World ${count.value}`)
}

async function onUseMessage() {
  try {
    await message.confirm({
      msg: '提示文案',
      title: '标题',
    })

    console.log('点击了确定按钮')
  }
  catch (error) {
    console.log('点击了取消按钮')
  }
}

async function onShowNotify() {
  setCountPlus()

  showNotify({
    type: 'success',
    message: `Hello World ${count.value}`,
  })
}
</script>

<template>
  <NavBar title="首页" />

  <WdButton @click="setCountPlus">
    count: {{ count }}
  </WdButton>

  <WdButton @click="onUseToast">
    useToast
  </WdButton>

  <WdButton @click="onUseMessage">
    useMessage
  </WdButton>

  <WdButton @click="onShowNotify">
    showNotify
  </WdButton>

  <VTabbar
    v-model="currentTab"
    fixed
    safe-area-inset-bottom
    placeholder
  />
</template>

<!-- <style lang="scss" scoped></style> -->

<route type="home" lang="yaml">
style:
  navigationBarTitleText: ""
  navigationStyle: "custom"
</route>
