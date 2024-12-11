import { AES, enc, mode, pad } from 'crypto-js'

export class CryptoAes {
  private static key = '__AES_KEY__'

  static decrypt(encryptedStr: string, pass = this.key) {
    if (!encryptedStr)
      return encryptedStr

    const key = enc.Utf8.parse(pass) // 通过密钥获取128位的key
    const encryptedHexStr = enc.Base64.parse(encryptedStr) // 解码base64编码结果
    const encryptedBase64Str = enc.Base64.stringify(encryptedHexStr)
    const decryptedData = AES.decrypt(encryptedBase64Str, key, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })

    return decryptedData.toString(enc.Utf8)
  }

  static encrypt(text: string, pass = this.key) {
    if (!text)
      return text

    const key = enc.Utf8.parse(pass) // 通过密钥获取128位的key

    const encrypted = AES.encrypt(text, key, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })

    return encrypted.ciphertext.toString(enc.Base64)
  }
}
