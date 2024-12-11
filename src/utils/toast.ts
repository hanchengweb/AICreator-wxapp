class Toast {
  private _show(title: string, icon: NonNullable<UniNamespace.ShowToastOptions['icon']>, duration: number) {
    uni.showToast({ title, icon, duration })
  }

  show(title: string, duration: number = 3 * 1000) {
    this._show(title, 'none', duration)
  }

  success(title: string, duration: number = 3 * 1000) {
    this._show(title, 'success', duration)
  }

  error(title: string, duration: number = 3 * 1000) {
    this._show(title, 'error', duration)
  }

  loading(title: string) {
    uni.showLoading({ title })
  }

  hideLoading() {
    uni.hideLoading()
  }
}

class Modal {
  private confirmText = '确定'
  private cancelText = '取消'

  show(content: string, confirmText = this.confirmText, title: string = '提示') {
    return new Promise<UniApp.ShowModalRes>((resolve, reject) => {
      uni.showModal({
        title,
        content,
        confirmText: confirmText || this.confirmText,
        showCancel: false,
        success: (res) => {
          resolve(res)
        },
        fail: err => reject(err),
      })
    })
  }

  confirm(content: string, confirmText = this.confirmText, cancelText = this.cancelText) {
    return new Promise<UniApp.ShowModalRes>((resolve, reject) => {
      uni.showModal({
        title: '提示',
        content,
        confirmText,
        cancelText,
        success: (res) => {
          resolve(res)
        },
        fail: err => reject(err),
      })
    })
  }
}

export const toast = new Toast()
export const modal = new Modal()
