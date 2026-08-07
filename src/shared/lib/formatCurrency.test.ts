import { describe, it, expect } from 'vitest'
import { formatCurrency, currencySymbol } from './formatCurrency'

describe('formatCurrency', () => {
  it('divides integer cents by 100 and formats with the currency symbol', () => {
    expect(formatCurrency(105000, 'USD', 'en')).toBe('$1,050.00')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0, 'USD', 'en')).toBe('$0.00')
  })

  it('formats a currency without a fractional cent (e.g. sub-unit amount)', () => {
    expect(formatCurrency(50, 'USD', 'en')).toBe('$0.50')
  })

  it('respects the locale grouping/decimal conventions per language', () => {
    // de-DE uses '.' for thousands and ',' for decimals.
    expect(formatCurrency(105000, 'EUR', 'de')).toBe('1.050,00 €')
  })

  it('formats a different ISO currency code', () => {
    expect(formatCurrency(105000, 'PEN', 'es')).toBe('S/ 1,050.00')
  })
})

describe('currencySymbol', () => {
  it('returns the symbol for a well-known currency', () => {
    expect(currencySymbol('USD', 'en')).toBe('$')
  })

  it('returns a different symbol per currency code', () => {
    expect(currencySymbol('EUR', 'en')).toBe('€')
    expect(currencySymbol('PEN', 'es')).toBe('S/')
  })
})
