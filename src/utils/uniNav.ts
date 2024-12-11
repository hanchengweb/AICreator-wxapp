import qs from 'qs'

class UniNav {
  _url<T extends Recordable = Recordable>(url: NavigateToOptions['url'], params?: T) {
    const hasParams = Object.keys(params ?? {}).length > 0
    return hasParams ? `${url}?${qs.stringify(params, { encode: false })}` : url
  }

  navigateTo<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    params?: T,
    options?: Omit<UniApp.NavigateToOptions, 'url'>,
  ) {
    uni.navigateTo({ url: this._url(url, params), ...options })
  }

  redirectTo<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    params?: T,
    options?: Omit<UniApp.RedirectToOptions, 'url'>,
  ) {
    uni.redirectTo({ url: this._url(url, params), ...options })
  }

  reLaunch<T extends Recordable = Recordable>(url: NavigateToOptions['url'], params?: T, options?: Omit<UniApp.ReLaunchOptions, 'url'>) {
    uni.reLaunch({ url: this._url(url, params), ...options })
  }

  switchTab<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    params?: T,
    options?: Omit<UniApp.SwitchTabOptions, 'url'>,
  ) {
    uni.switchTab({ url: this._url(url, params), ...options })
  }

  navigateBack(delta?: number, options?: Omit<UniApp.NavigateBackOptions, 'delta'>) {
    uni.navigateBack({ delta, ...options })
  }
}

export const uniNav = new UniNav()
