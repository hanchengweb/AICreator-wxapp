import { dateUtil } from './dateUtil'

// 防抖
// eslint-disable-next-line ts/no-unsafe-function-type
export function debounce(fn: Function, delay: number = 200) {
  let timer: any
  // 闭包
  return (...args: any[]) => {
    // 如果不是剪头函数可以使用arguments获取参数，这样就不用写形参了考虑形参个数了
    // let args = arguments;
    // 判断还在定时，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      return fn(...args)
    }, delay)
  }
}

export function tempToBase64(temp: string) {
  return new Promise<string>((resolve, reject) => {
    const baseFormat = 'data:image/png;base64,'
    const base64 = wx.getFileSystemManager().readFileSync(temp, 'base64') as string
    resolve(baseFormat + base64)
  })
}

/**
 * @description: 身份证判断是否成年
 * @param {string} no 接收的字符串（身份证号）
 * @return {boolean} 是否成年
 */
export function idCardIsAdult(no: string = ''): boolean {
  if (!no)
    return false

  const year = no.substring(6, 10)
  const month = no.substring(10, 12)
  const day = no.substring(12, 14)

  const birth = `${year}-${month}-${day}`

  const legalAgeDate = dateUtil(birth).add(18, 'year')

  if (dateUtil(legalAgeDate).isSame(new Date(), 'day')) {
    return true
  }

  return dateUtil(legalAgeDate).isBefore(new Date(), 'day')
}

export function JsonParse(value: string) {
  try {
    return JSON.parse(value)
  }
  catch (error) {
    return {}
  }
}
