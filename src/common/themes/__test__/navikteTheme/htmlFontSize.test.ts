import { describe, it, expect } from 'vitest'
import { htmlFontSize } from '../../navikeTheme/htmlFontSize'

describe('getHtmlFontSize', () => {
  it('should return 20 for XS', () => {
    expect(htmlFontSize.xsmall).toBe(20)
  })

  it('should return 18 for SM', () => {
    expect(htmlFontSize.small).toBe(18)
  })

  it('should return 16 for MD', () => {
    expect(htmlFontSize.medium).toBe(16)
  })

  it('should return 12 for LG', () => {
    expect(htmlFontSize.large).toBe(12)
  })

  it('should return 10 for XL', () => {
    expect(htmlFontSize.xlarge).toBe(10)
  })

  it('should return 8 for XXL', () => {
    expect(htmlFontSize.xxlarge).toBe(8)
  })

  it('should return 6 for XXXL', () => {
    expect(htmlFontSize.xxxlarge).toBe(6)
  })
})
