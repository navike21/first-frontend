import { describe, it, expect } from 'vitest'
import {
  applyMask,
  digitsOnly,
  formatNumeric,
  maskDigitCount,
  sanitizeNumeric,
} from './InputNumber.format'

const opts = (over: Partial<Parameters<typeof sanitizeNumeric>[1]> = {}) => ({
  decimals: 0,
  allowNegative: false,
  thousandSeparator: false,
  ...over,
})

describe('sanitizeNumeric', () => {
  it('strips letters and symbols', () => {
    expect(sanitizeNumeric('12a3b4', opts())).toBe('1234')
  })

  it('drops decimals when decimals=0', () => {
    expect(sanitizeNumeric('1234.99', opts())).toBe('1234')
  })

  it('keeps up to `decimals` places', () => {
    expect(sanitizeNumeric('1234.099', opts({ decimals: 2 }))).toBe('1234.09')
  })

  it('collapses multiple dots into one', () => {
    expect(sanitizeNumeric('12.3.4', opts({ decimals: 2 }))).toBe('12.34')
  })

  it('ignores a negative sign unless allowed', () => {
    expect(sanitizeNumeric('-50', opts())).toBe('50')
    expect(sanitizeNumeric('-50', opts({ allowNegative: true }))).toBe('-50')
  })
})

describe('formatNumeric', () => {
  it('groups thousands when enabled', () => {
    expect(
      formatNumeric('1250.9', opts({ decimals: 2, thousandSeparator: true }))
    ).toBe('1,250.9')
    expect(formatNumeric('1200', opts({ thousandSeparator: true }))).toBe(
      '1,200'
    )
  })

  it('does not group when disabled', () => {
    expect(formatNumeric('1200', opts())).toBe('1200')
  })

  it('preserves a trailing dot while typing', () => {
    expect(formatNumeric('1234.', opts({ decimals: 2 }))).toBe('1234.')
  })

  it('keeps the negative sign', () => {
    expect(
      formatNumeric(
        '-1200',
        opts({ allowNegative: true, thousandSeparator: true })
      )
    ).toBe('-1,200')
  })
})

describe('applyMask', () => {
  it('formats a phone with country code', () => {
    expect(applyMask('51989505027', '+## ### ### ###')).toBe('+51 989 505 027')
  })

  it('formats partial input without a trailing separator', () => {
    expect(applyMask('51', '+## ### ### ###')).toBe('+51')
    expect(applyMask('519', '+## ### ### ###')).toBe('+51 9')
  })

  it('returns empty for no digits', () => {
    expect(applyMask('', '+## ### ### ###')).toBe('')
  })

  it('stops when the mask is full', () => {
    expect(applyMask('123456789', '### ###')).toBe('123 456')
  })
})

describe('digitsOnly / maskDigitCount', () => {
  it('keeps only digits', () => {
    expect(digitsOnly('+51 989-505')).toBe('51989505')
  })

  it('counts the # placeholders', () => {
    expect(maskDigitCount('+## ### ### ###')).toBe(11)
  })
})
