/*
 * @Date: 2023-07-05 10:06:28
 * @LastEditors: yikoyu 2282373181@qq.com
 * @LastEditTime: 2023-07-21 14:43:32
 * @FilePath: \Wechat-PMS-Traveler\src\api\_url.ts
 */
export const URL = {
  wxAuthorizeLoginCode: '/login/wxAuthorizeLoginCode', // 新版微信一键登录
  doWxLogin: '/login/doWxLogin', // 微信快捷登录
  mlogin: '/mlogin', // 手机号登录
  logout: '/logout', // 退出登录
  sendSmsCheck: '/sendSmsCheck', // 获取滑块验证码
  sendSms: '/sendSms', // 发送验证码
  getLoginUser: '/getLoginUser', // 获取当前登录用户信息
}

const WHITE_LIST = [URL.wxAuthorizeLoginCode, URL.doWxLogin, URL.mlogin, URL.sendSmsCheck, URL.sendSms]

export function isWhiteList(path?: string) {
  return path ? WHITE_LIST.includes(path) : true
}
