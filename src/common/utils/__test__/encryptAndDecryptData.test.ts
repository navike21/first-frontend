import { describe, it, expect } from 'vitest'
import { encryptData, decryptData } from '../encryptAndDecryptData'

describe('encryptAndDecryptData (Frontend)', () => {
  const testData = 'Hello, World!'

  it('should encrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    expect(encryptedData).not.toBe(testData)
    expect(encryptedData).toContain(':') // Validar que el IV y el texto cifrado están concatenados
  })

  it('should decrypt data correctly', () => {
    const encryptedData = encryptData(testData)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(testData)
  })

  it('should produce different encrypted values for the same input', () => {
    const encryptedData1 = encryptData(testData)
    const encryptedData2 = encryptData(testData)
    expect(encryptedData1).not.toBe(encryptedData2)
  })

  it('should handle empty strings correctly', () => {
    const testEmptyString = ''
    const encryptedData = encryptData(testEmptyString)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(testEmptyString)
  })

  it('should handle special characters correctly', () => {
    const specialCharacters = '!@#$%^&*()_+-=[]{}|;:",.<>?/`~'
    const encryptedData = encryptData(specialCharacters)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(specialCharacters)
  })

  it('should handle long strings correctly', () => {
    const longString = 'a'.repeat(1000)
    const encryptedData = encryptData(longString)
    const decryptedData = decryptData(encryptedData)
    expect(decryptedData).toBe(longString)
  })
})
