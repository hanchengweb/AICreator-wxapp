import { onMounted, onUnmounted, ref } from 'vue'

export default function useNetwork() {
  const isConnected = ref(true)
  const networkType = ref<Nullable<string>>(null)

  function showNotNetworkModal() {
    uni.showModal({
      title: '提示',
      content: '当前处于离线状态，请检查网络',
      confirmText: '我知道了',
      showCancel: false,
    })
  }

  function onNetworkStatusChange(res: UniApp.OnNetworkStatusChangeSuccess) {
    console.log('[useNetwork] 监听网络变化 变化', res)
    isConnected.value = res.isConnected
    networkType.value = res.networkType
  }

  onMounted(() => {
    console.log('[useNetwork] 监听网络变化 开启')
    uni.onNetworkStatusChange(onNetworkStatusChange)
  })

  onUnmounted(() => {
    console.log('[useNetwork] 监听网络变化 停止')
    uni.offNetworkStatusChange(onNetworkStatusChange)
  })

  return {
    showNotNetworkModal,
    isConnected,
    networkType,
  }
}
