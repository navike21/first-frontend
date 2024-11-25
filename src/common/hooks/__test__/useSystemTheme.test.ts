import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'
import { EThemeBrowser } from '@Enums/browser'
import { EColors } from '@Enums/color'
import { useSystemTheme } from '../useSystemTheme'

describe('useSystemTheme', () => {
  const addEventListenerMock = vi.fn()
  const removeEventListenerMock = vi.fn()

  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    addEventListener: addEventListenerMock,
    removeEventListener: removeEventListenerMock,
    dispatchEvent: vi.fn(),
  }))

  it('should set theme to dark when system theme is dark', () => {
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.setTheme({
        theme: EThemeBrowser.SYSTEM,
        themeValue: EThemeBrowser.LIGHT,
        color: EColors.GREEN,
      })
    })

    expect(result.current.theme).toBe(EThemeBrowser.SYSTEM)

    renderHook(() => useSystemTheme())

    const mediaQuery = global.matchMedia('(prefers-color-scheme: dark)')

    Object.defineProperty(mediaQuery, 'matches', {
      value: true,
      configurable: true,
    })

    act(() => {
      mediaQuery.dispatchEvent(new Event('change'))
    })

    expect(result.current.themeValue).toBe(EThemeBrowser.DARK)
  })
})
