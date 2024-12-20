import { environments } from '@Constants/environments'
import CryptoJS from 'crypto-js'

const { VITE_ENCRYPTION_KEY } = environments

export const encryptData = (data: string) => {
  const iv = CryptoJS.lib.WordArray.random(16)
  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_KEY),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  )
  return `${CryptoJS.enc.Base64.stringify(iv)}:${encrypted.toString()}`
}

export const decryptData = (encryptedData: string) => {
  const [ivBase64, ciphertext] = encryptedData.split(':')
  const iv = CryptoJS.enc.Base64.parse(ivBase64)
  const decrypted = CryptoJS.AES.decrypt(
    ciphertext,
    CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_KEY),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}
