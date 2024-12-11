import { uniNav } from '@/utils/uniNav'

import { isString } from 'lodash-es'

export default function useNtDetect(mode: 'navigateTo' | 'redirectTo' = 'redirectTo') {
  function hasDetected(query: AnyObject | undefined) {
    const { event } = query || {}

    return !!event
  }

  function getNtToken(query: AnyObject | undefined) {
    const { event, data } = query || {}

    if (event === 'verify' && isString(data) && data.length > 0) {
      return data
    }
  }

  function toNtDetect(backUrl: string, query: AnyObject | undefined) {
    console.log(`toNtDetect[${backUrl}] :>> `, query)

    uniNav[mode]('/pages/detect/index', {
      ...query,
      verify_url: backUrl,
      _show: '1',
    })
  }

  return {
    toNtDetect,
    getNtToken,
    hasDetected,
  }
}
