import { describe, it, expect, vi } from 'vitest'
import { getSystemTheme } from '../themeUtils'
import { EThemeBrowser } from '@Enums/index'

describe('getSystemTheme', () => {
  it('should return DARK when prefers-color-scheme is dark', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
      })),
    })

    expect(getSystemTheme()).toBe(EThemeBrowser.DARK)
  })

  it('should return LIGHT when prefers-color-scheme is light', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)',
      })),
    })

    expect(getSystemTheme()).toBe(EThemeBrowser.LIGHT)
  })
})
