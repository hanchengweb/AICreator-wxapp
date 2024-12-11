/* eslint-disable ts/no-unsafe-function-type */
import { isWhiteList } from '@/api/_url'

import { useAppStore } from '@/stores/app'
import Request, { type HttpError, type HttpRequestConfig, type HttpResponse } from 'luch-request'

const HTTP_RESULT_KEY_DATA = 'data'
const HTTP_RESULT_KEY_MSG = 'msg'
const HTTP_RESULT_KEY_STATUS = 'status'
const HTTP_RESULT_KEY_STATUS_SUCCESS = 200

class RefreshToken {
  private isRefreshing = true
  private subscribers: Function[] = []

  instance: Request

  constructor(instance: Request) {
    this.instance = instance
  }

  public _goToWelcome() {
    const pages = getCurrentPages()
    const curPages = pages[pages.length - 1].route

    if (curPages && ['pages/login/login'].includes(curPages))
      return
    uni.reLaunch({ url: '/pages/login/login' })
  }

  private onAccessTokenFetched() {
    this.subscribers.forEach(callback => callback())
    this.subscribers = []
    this.isRefreshing = true
  }

  private addSubscriber(callback: Function) {
    this.subscribers.push(callback)
  }

  public refresh(response: HttpError, resolve: Function, reject: Function) {
    // 登录过期，刷新 token
    const app = useAppStore()

    // 将需要重新执行的接口缓存到一个队列中
    if (!isWhiteList(response.config.url)) {
      this.addSubscriber(() => {
        this.instance
          .request(response.config)
          .then(res => resolve(res))
          .catch((error) => {
            console.log('RefreshToken :>> ', error)
          })
      })
    }

    if (this.isRefreshing) {
      app
        .doWxLogin()
        .then(() => {
          // 刷新成功，依次执行缓存接口
          this.onAccessTokenFetched()
        })
        .catch((_err) => {
          this._goToWelcome()
        })

      this.isRefreshing = false
    }
  }
}

class RequestInstance extends RefreshToken {
  instance: Request

  constructor(config: HttpRequestConfig) {
    const _instance = new Request(config)

    super(_instance)

    this.instance = _instance
    this.instance.interceptors.request.use(this.request, this.requestError.bind(this) as any)
    this.instance.interceptors.response.use(this.response.bind(this), this.responseError.bind(this))
  }

  private requestError(err: HttpError) {
    console.log(`[request.error] ${err.config.url} :>>`, err)

    const hasToast = err.config.custom?.toast === true

    const errorTitles: Record<string, string> = {
      'request:fail timeout': '请求超时请重试',
    }

    const title = errorTitles[err.errMsg]
    if (title && hasToast) {
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title, icon: 'none' })
      }, 1 * 1000)
    }

    return Promise.reject(err)
  }

  private responseError(err: HttpError) {
    console.log(`[response.error] ${err.config.url} :>>`, err)

    const app = useAppStore()

    const errorTitles: Record<string, string> = {
      'request:fail timeout': '请求超时请重试',
    }

    const hasToast = err.config.custom?.toast === true

    return new Promise((resolve, reject) => {
      const isLogout = err.statusCode === 499

      if (isLogout) {
        console.log('[request.refresh] token')
        app
          .resetToken()
          .then(() => this.refresh(err, resolve, reject))
          .catch(error => reject(error))
      }
      else {
        const title = errorTitles[err.errMsg ?? -1] ?? err.data?.[HTTP_RESULT_KEY_MSG]
        if (title && hasToast) {
          setTimeout(() => {
            uni.hideLoading()
            uni.showToast({ title, icon: 'none' })
          }, 1 * 1000)
        }

        return reject(err)
      }
    })
  }

  private request(config: HttpRequestConfig) {
    const app = useAppStore()

    // 携带 token 需要根据业务修改
    if (config.header && app.accessToken && !isWhiteList(config.url)) {
      config.header.Authorization = `Bearer ${app.accessToken}` // 让每个请求携带自定义 token
    }

    console.log(`[request.request] ${config.url} :>>`, config)
    return config
  }

  private response(response: HttpResponse) {
    // 这里自定义 token 过期和刷新逻辑
    console.log(`[request.response] ${response.config.url} :>>`, response)

    // 没有传 token
    const isNotToken = response.statusCode === 200 && response.data[HTTP_RESULT_KEY_STATUS] === 1011004

    if (isNotToken) {
      this._goToWelcome()
      return Promise.reject(response)
    }

    // 接口错误
    if (response.data[HTTP_RESULT_KEY_STATUS] !== HTTP_RESULT_KEY_STATUS_SUCCESS) {
      uni.hideLoading()
      uni.showToast({ title: response.data?.[HTTP_RESULT_KEY_MSG], icon: 'none' })

      return Promise.reject(response)
    }

    return Promise.resolve(response)
  }
}

const { instance: request } = new RequestInstance({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 30 * 1000,
  method: 'POST',
  dataType: 'json',
  withCredentials: true,
  header: {
    'content-type': 'application/json', // 默认值
  },
  custom: {
    checkNetwork: true,
    toast: true,
  },
})

export { request }
