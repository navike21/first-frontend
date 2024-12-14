import { environments } from '@Constants/environments'
import CryptoJS from 'crypto-js'

const { VITE_ENCRYPTION_IV, VITE_ENCRYPTION_KEY } = environments

export const encryptData = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString()
  return encrypted
}

export const decryptData = (ciphertext: string): string => {
  const decrypted = CryptoJS.AES.decrypt(
    ciphertext,
    CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(VITE_ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8)
  return decrypted
}
