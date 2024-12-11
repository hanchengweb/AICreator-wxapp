import { URL } from '@/api/_url'
import { request } from '@/utils/request'

export interface SendSmsData {
  captchaTrack: {
    bgImageHeight: number
    bgImageWidth: number
    endSlidingTime: string
    sliderImageHeight: number
    sliderImageWidth: number
    startSlidingTime: string
    trackList: {
      t: number
      type: 'down' | 'move' | 'up'
      x: number
      y: number
    }[]
  }

  form: {
    phone: string
  }

  id: string
}

/**
 * @description: 获取滑块验证码
 */
export function sendSmsCheck() {
  return request.get(URL.sendSmsCheck)
}

/**
 * @description: 发送验证码
 */
export function sendSms(data: SendSmsData) {
  return request.post(URL.sendSms, data)
}
