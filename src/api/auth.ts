import { request } from '@/utils/request'

import { URL } from './_url'

/**
 * @description: 新版微信一键登录
 * @param {string} loginCode
 * @param {string} phoneCode
 */
export function wechatLoginCode(loginCode: string, phoneCode: string) {
  return request.post(URL.wxAuthorizeLoginCode, {
    loginCode,
    phoneCode,
  })
}

/**
 * @description: 微信 code 快捷登录
 * @param {string} code
 */
export function doWxLogin(code: string) {
  return request.post(URL.doWxLogin, {
    code,
  })
}

/**
 * @description: 手机号登录
 * @param {string} phone
 * @param {string} verificationCode
 */
export function mLogin(phone: string, verificationCode: string) {
  return request.post(URL.mlogin, {
    phone,
    verificationCode,
  })
}

/**
 * @description: 退出登录
 */
export function logout() {
  return request.get(URL.logout)
}

/**
 * @description: 获取当前登录用户信息
 */
export function getLoginUserInfo() {
  return request.get(URL.getLoginUser)
}
