type OmitCallback<T> = Omit<T, 'success' | 'fail' | 'complete'>

function takePhoto(ctx: UniNamespace.CameraContext, options: OmitCallback<UniApp.CameraContextTakePhotoOptions>) {
  return new Promise<UniApp.CameraContextTakePhotoResult>((resolve, reject) => {
    ctx.takePhoto({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}

function compressImage(options: OmitCallback<UniApp.CompressImageOptions>) {
  return new Promise((resolve, reject) => {
    uni.compressImage({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err),
    })
  })
}

function promise<U extends (...args: any) => any, Data extends Parameters<NonNullable<Parameters<U>[0]>['success']>[0]>(
  callback: U,
) {
  return (options?: OmitCallback<Parameters<U>[0]>) => {
    return new Promise<Data>((resolve, reject) => {
      callback({
        ...options,
        success: (res: Data) => resolve(res),
        fail: (err: unknown) => reject(err),
      })
    })
  }
}

export function uniAwaitHandler<
  U extends (...args: any) => any,
  ErrorProps extends object | null,
  Data extends Parameters<NonNullable<Parameters<U>[0]>['success']>[0],
>(callback: U) {
  return (options?: OmitCallback<Parameters<U>[0]>) => {
    return new Promise<[error: ErrorProps | null, data: Data | null]>((resolve, reject) => {
      callback({
        ...options,
        success: (res: Data | null) => resolve([null, res]),
        // eslint-disable-next-line prefer-promise-reject-errors
        fail: (err: ErrorProps | null) => reject([err, null]),
      })
    })
  }
}

export default { takePhoto, compressImage, promise }
