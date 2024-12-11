import { useIntervalFn } from '@vueuse/core'
import { ref, unref } from 'vue'

export default function useCountDown(interval: number = 1000) {
  const counter = ref(0)

  const { pause, resume, isActive } = useIntervalFn(
    () => {
      counter.value--
      if (unref(counter) <= 0) {
        pause() // 停止定时器
      }
    },
    interval,
    { immediate: false },
  )

  function start(sec: number = 2 * 60) {
    counter.value = sec
    resume() // 开启定时器
  }

  return {
    start,
    counter,
    isActive,
  }
}
