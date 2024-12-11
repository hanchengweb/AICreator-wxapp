import type { ConfigType, Dayjs } from 'dayjs' // 设置 dayjs 中文

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
// import calendar from 'dayjs/plugin/calendar'
// import localizedFormat from 'dayjs/plugin/localizedFormat'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import weekday from 'dayjs/plugin/weekday'

// dayjs.extend(calendar)
// dayjs.extend(localizedFormat)
// dayjs.extend(relativeTime)
// dayjs.extend(weekday)

export const DATE_TIME_SEC_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm'
export const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 将时间转换为 YYYY-MM-DD HH:mm
 * @export
 * @param {ConfigType} [date]
 * @param {string} [format]
 * @return {*}  {string}
 */
export function formatToTime(date?: ConfigType, format: string = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 将时间转换为 YYYY-MM-DD HH:mm:ss
 * @export
 * @param {ConfigType} [date]
 * @param {string} [format]
 * @return {*}  {string}
 */
export function formatToTimeSec(date?: ConfigType, format: string = DATE_TIME_SEC_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 将时间转换为 YYYY-MM-DD
 * @export
 * @param {ConfigType} [date]
 * @param {string} [format]
 * @return {*}  {string}
 */
export function formatToDate(date?: ConfigType, format: string = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 获取时间戳
 * @export
 * @param {ConfigType} [date]
 * @return {*}  {number}
 */
export function getTimestamp(date?: ConfigType): number {
  return dayjs(date).unix()
}

/**
 * 获取时间戳（毫秒级）
 * @export
 * @param {ConfigType} [date]
 * @return {*}  {number}
 */
export function getMillisecond(date?: ConfigType): number {
  return dayjs(date).valueOf()
}

export type { ConfigType, Dayjs }
export { dayjs as dateUtil, dayjs }
