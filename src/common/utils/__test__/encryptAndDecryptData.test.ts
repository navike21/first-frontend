import { describe, it, expect } from 'vitest'
import { encryptData, decryptData } from '../encryptAndDecryptData'

describe('encryptAndDecryptData', () => {
  const testData = 'Hello, World!'

  it('should encrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    expect(encryptedData).toBeDefined()
    expect(encryptedData).not.toBe(testData)
  })

  it('should decrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(testData)
  })

  it('should return empty string when decrypting invalid data', () => {
    const decryptedData = decryptData('invalid data')
    expect(decryptedData).toBe('')
  })
})
