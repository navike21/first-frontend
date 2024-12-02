import { describe, vi, it, expect } from 'vitest'
import { navikeTheme } from '../../navikeTheme/navikeTheme'
import { TMaterialTheme } from '@Types/theme'
import { EThemeBrowser } from '@Enums/browser'
import { ESizes } from '@Enums/sizes'
import { EColors } from '@Enums/color'

describe('navikeTheme', () => {
  vi.mock('@mui/material', () => ({
    createTheme: vi.fn(),
  }))

  vi.mock('../../navikeTheme/navikeTheme', () => ({
    navikeTheme: vi.fn(),
  }))

  const themeOptions: TMaterialTheme = {
    themeMode: EThemeBrowser.LIGHT,
    textSize: ESizes.MD,
    color: EColors.GREEN,
  }
  it('should create a theme', () => {
    navikeTheme(themeOptions)

    expect(navikeTheme).toHaveBeenCalledWith(themeOptions)
  })

  it('should create a theme with the given options', () => {
    navikeTheme(themeOptions)

    expect(navikeTheme).toHaveReturned()
  })
})
