import { useAppStore } from '@/stores/app'
import { toast } from '@/utils/toast'
import uniPromise from '@/utils/uniPromise'
import { ref, unref } from 'vue'

export function useWechatLogin(hooks?: Fn) {
  const selected = ref(true)

  const reLaunchUrl = ref('')

  const app = useAppStore()

  async function getWechatLoginCode() {
    // 5分钟过期，写定时器去获取
    // 一天的调用总次数不多于该小程序pv的两倍

    try {
      const { code: _code } = await uniPromise.promise(uni.login)({
        provider: 'weixin',
        onlyAuthorize: true,
      })

      console.log('[uni.login] success :>> ', _code)

      return _code
    }
    catch (error) {
      console.log('[uni.login] error :>> ', error)
    }
  }

  async function getPhoneNumber(e: Recordable) {
    if (!unref(selected)) {
      // toast.show('请阅读并勾选底部协议')
      return
    }

    const { code } = e.detail
    if (!code) {
      return
    }

    const loginCode = await getWechatLoginCode()

    if (!loginCode) {
      return
    }

    try {
      const token = await app.wechatLogin(loginCode, code)

      if (hooks) {
        hooks(token)
        return
      }

      if (token) {
        uni.reLaunch({ url: reLaunchUrl.value || '/pages/home/home' })
      }
    }
    catch (error: any) {
      const isSessionKeyError = error.data?.status === 1009

      if (isSessionKeyError) {
        getWechatLoginCode()
        toast.error('登录失败请重试')
      }

      console.log('[wechatLogin] error :>> ', error)
    }

    // 登录 API
  }

  return {
    reLaunchUrl,
    selected,
    getWechatLoginCode,
    getPhoneNumber,
  }
}
