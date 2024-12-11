import { doWxLogin, getLoginUserInfo, logout, mLogin, wechatLoginCode } from '@/api/auth'

import { CryptoAes } from '@/utils/aes'
import { getTimestamp } from '@/utils/dateUtil'
import { toast } from '@/utils/toast'
import { uniNav } from '@/utils/uniNav'
import uniPromise from '@/utils/uniPromise'
import { defineStore } from 'pinia'

interface IState {
  loginTimestamp: number
  accessToken: string
  accessTokenExpire: number
  refreshToken: string
  refreshTokenExpire: number
  isLastLoginWechat: boolean
  user: Recordable
}

export const useAppStore = defineStore('app', {
  persist: {
    key: 'pinia-app',
    paths: [
      'loginTimestamp',
      'accessToken',
      'accessTokenExpire',
      'refreshToken',
      'refreshTokenExpire',
      'isLastLoginWechat',
    ],
  },
  state: (): IState => ({
    loginTimestamp: -1,
    accessToken: '',
    accessTokenExpire: -1,
    refreshToken: '',
    refreshTokenExpire: -1,
    isLastLoginWechat: false,
    user: {},
  }),

  actions: {
    setToken(data: Recordable) {
      this.loginTimestamp = getTimestamp()
      this.accessToken = data.accessToken
      this.accessTokenExpire = data.accessTokenExpire
      this.refreshToken = data.refreshToken
      this.refreshTokenExpire = data.refreshTokenExpire
    },

    resetToken() {
      return new Promise<void>((resolve, reject) => {
        this.loginTimestamp = -1
        this.accessToken = ''
        this.accessTokenExpire = -1
        this.refreshToken = ''
        this.refreshTokenExpire = 1
        this.user = {}
        resolve()
      })
    },

    wechatLogin(loginCode: string, phoneCode: string) {
      return new Promise<string | void>((resolve, reject) => {
        toast.loading('登录中...')

        this.resetToken()
        wechatLoginCode(loginCode, phoneCode)
          .then((res) => {
            // 登录成功
            this.setToken(res.data.data)
            this.isLastLoginWechat = true
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    doWxLogin() {
      return new Promise<string | void>((resolve, reject) => {
        if (this.isLogin) {
          resolve(this.accessToken)
          return
        }

        if (!this.isLastLoginWechat) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ statusCode: -1, msg: '最后一次登录不是微信，请使用微信登录' })
          return
        }

        uniPromise
          .promise(uni.login)({
            provider: 'weixin',
            onlyAuthorize: true,
          })
          .then(({ code }) => {
            return doWxLogin(code)
          })
          .then((res) => {
            // 登录成功
            this.setToken(res.data.data)
            this.isLastLoginWechat = true
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            const isToLogin
              = err.statusCode === 497 // 无微信登录信息
              || err.statusCode === 498 // 账号注销中
            if (isToLogin) {
              this.resetToken()
              uniNav.reLaunch('/pages/login/login')
              return reject(new Error('快捷登录失败，请重试'))
            }

            // 登录失败处理
            if (err.data.status !== 200) {
              this.resetToken()
              uniNav.reLaunch('/pages/login/login')
              return reject(new Error(err.data.msg ?? '快捷登录失败，请重试'))
            }

            return reject(err)
          })
      })
    },

    mLogin(phone: string, verificationCode: string) {
      return new Promise<string | void>((resolve, reject) => {
        toast.loading('登录中...')

        mLogin(phone, verificationCode)
          .then((res) => {
            // 登录成功
            this.setToken(res.data.data)
            this.isLastLoginWechat = false
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    logout() {
      return new Promise<void>((resolve, reject) => {
        toast.loading('正在退出...')

        logout()
          .then(() => {
            this.resetToken()
            this.isLastLoginWechat = false
            uniNav.reLaunch('/pages/login/login')
            toast.hideLoading()
            resolve()
          })
          .catch((_err) => {
            this.resetToken()
            this.isLastLoginWechat = false
            uniNav.reLaunch('/pages/login/login')
            toast.hideLoading()
            resolve()
          })
      })
    },

    getLoginUserInfo(regain = false) {
      return new Promise<IState['user'] | null>((resolve, reject) => {
        const hasUserInfo = Object.keys(this.user).length > 0
        if (hasUserInfo && !regain) {
          resolve(this.user)
          return
        }

        getLoginUserInfo()
          .then((res) => {
            this.user = res.data.data
            resolve(this.user)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },

  getters: {
    isLogin(state) {
      const expireTimestamp = state.loginTimestamp + state.accessTokenExpire
      const now = getTimestamp()
      return !!(state.accessToken && expireTimestamp > now)
    },

    hasToken(state) {
      return state.accessToken
    },

    userPhone(state) {
      const { exPhone } = state.user || {}
      if (!exPhone)
        return ''

      return CryptoAes.decrypt(exPhone)
    },
  },
})
