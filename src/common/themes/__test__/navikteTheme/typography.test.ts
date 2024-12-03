import { describe, it, expect } from 'vitest'
import { createTheme, Theme } from '@mui/material/styles'
import { typography } from './../../navikeTheme/typography'

interface ITypographyOptionsTest {
  [key: string]: { fontSize: string; fontWeight: number }
}

describe('typography', () => {
  const baseTheme: Theme = createTheme()
  const result = typography(baseTheme)

  it('should return typography options with correct font sizes for h1', () => {
    const h1 = result.h1 as ITypographyOptionsTest | undefined

    expect(h1).toBeDefined()
    if (!h1) throw new Error('h1 is not defined')

    expect(h1.fontWeight).toBe(600)

    const xsFontSize = h1[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h1[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h1[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(32))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(36))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(40))
  })

  it('should return typography options with correct font sizes for h2', () => {
    const h2 = result.h2 as ITypographyOptionsTest | undefined

    expect(h2).toBeDefined()
    if (!h2) throw new Error('h2 is not defined')

    expect(h2.fontWeight).toBe(600)

    const xsFontSize = h2[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h2[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h2[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(28))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(32))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(36))
  })

  it('should return typography options with correct font sizes for h3', () => {
    const h3 = result.h3 as ITypographyOptionsTest | undefined

    expect(h3).toBeDefined()
    if (!h3) throw new Error('h3 is not defined')

    expect(h3.fontWeight).toBe(600)

    const xsFontSize = h3[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h3[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h3[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(24))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(28))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(32))
  })

  it('should return typography options with correct font sizes for h4', () => {
    const h4 = result.h4 as ITypographyOptionsTest | undefined

    expect(h4).toBeDefined()
    if (!h4) throw new Error('h4 is not defined')

    expect(h4.fontWeight).toBe(600)

    const xsFontSize = h4[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h4[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h4[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(20))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(24))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(28))
  })

  it('should return typography options with correct font sizes for h5', () => {
    const h5 = result.h5 as ITypographyOptionsTest | undefined

    expect(h5).toBeDefined()
    if (!h5) throw new Error('h5 is not defined')

    expect(h5.fontWeight).toBe(600)

    const xsFontSize = h5[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h5[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h5[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(16))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(16))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(18))
  })

  it('should return typography options with correct font sizes for h6', () => {
    const h6 = result.h6 as ITypographyOptionsTest | undefined

    expect(h6).toBeDefined()
    if (!h6) throw new Error('h6 is not defined')

    expect(h6.fontWeight).toBe(600)

    const xsFontSize = h6[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = h6[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = h6[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(12))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(14))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(16))
  })

  it('should return typography options with correct font sizes for subtitle1', () => {
    const subtitle1 = result.subtitle1 as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(subtitle1).toBeDefined()
    if (!subtitle1) throw new Error('subtitle1 is not defined')

    const xsFontSize = subtitle1[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = subtitle1[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = subtitle1[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(10))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(12))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(14))
  })

  it('should return typography options with correct font sizes for subtitle2', () => {
    const subtitle2 = result.subtitle2 as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(subtitle2).toBeDefined()
    if (!subtitle2) throw new Error('subtitle2 is not defined')

    const xsFontSize = subtitle2[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = subtitle2[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = subtitle2[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(8))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(10))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(12))
  })

  it('should return typography options with correct font sizes for caption', () => {
    const caption = result.caption as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(caption).toBeDefined()
    if (!caption) throw new Error('caption is not defined')

    const xsFontSize = caption[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = caption[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = caption[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(8))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(10))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(12))
  })

  it('should return typography options with correct font sizes for body1', () => {
    const body1 = result.body1 as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(body1).toBeDefined()
    if (!body1) throw new Error('body1 is not defined')

    const xsFontSize = body1[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = body1[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = body1[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(11))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(12))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(14))
  })

  it('should return typography options with correct font sizes for body2', () => {
    const body2 = result.body2 as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(body2).toBeDefined()
    if (!body2) throw new Error('body2 is not defined')

    const xsFontSize = body2[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = body2[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = body2[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(8))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(10))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(12))
  })

  it('should return typography options with correct font sizes for button', () => {
    const button = result.button as
      | { [key: string]: { fontSize: string } }
      | undefined

    expect(button).toBeDefined()
    if (!button) throw new Error('button is not defined')

    const xsFontSize = button[baseTheme.breakpoints.up('xs')]?.fontSize
    const smFontSize = button[baseTheme.breakpoints.up('sm')]?.fontSize
    const mdFontSize = button[baseTheme.breakpoints.up('md')]?.fontSize

    expect(xsFontSize).toBe(baseTheme.typography.pxToRem(12))
    expect(smFontSize).toBe(baseTheme.typography.pxToRem(14))
    expect(mdFontSize).toBe(baseTheme.typography.pxToRem(16))
  })
})
