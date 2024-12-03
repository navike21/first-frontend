import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../config'
import { EColors, ESizes, EThemeBrowser } from '@Enums/index'
import { TThemeBrowser } from '@Store/index'

describe('useThemeStore', () => {
  beforeEach(() => {
    // Mocking window.matchMedia
    global.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)', // Simula la preferencia por tema oscuro
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    useThemeStore.setState({
      color: EColors.GREEN,
      theme: EThemeBrowser.SYSTEM,
      themeValue: EThemeBrowser.SYSTEM as TThemeBrowser,
      textSize: ESizes.MD,
    })
  })

  it('should initialize with default values', () => {
    const state = useThemeStore.getState()
    expect(state.color).toBe(EColors.GREEN)
    expect(state.theme).toBe(EThemeBrowser.SYSTEM)
    expect(state.themeValue).toBe(EThemeBrowser.SYSTEM)
    expect(state.textSize).toBe(ESizes.MD)
  })

  it('should toggle theme', () => {
    const { toggleTheme } = useThemeStore.getState()
    toggleTheme()
    expect(useThemeStore.getState().theme).toBe(EThemeBrowser.LIGHT)
    expect(useThemeStore.getState().themeValue).toBe(EThemeBrowser.LIGHT)
    toggleTheme()
    expect(useThemeStore.getState().theme).toBe(EThemeBrowser.DARK)
    expect(useThemeStore.getState().themeValue).toBe(EThemeBrowser.DARK)
  })

  it('should set theme', () => {
    const { setTheme } = useThemeStore.getState()
    setTheme({
      theme: EThemeBrowser.LIGHT,
      themeValue: EThemeBrowser.LIGHT,
      color: EColors.GREEN,
    })
    expect(useThemeStore.getState().theme).toBe(EThemeBrowser.LIGHT)
    expect(useThemeStore.getState().themeValue).toBe(EThemeBrowser.LIGHT)
  })

  it('should set text size', () => {
    const { setTextSize } = useThemeStore.getState()
    setTextSize(ESizes.LG)
    expect(useThemeStore.getState().textSize).toBe(ESizes.LG)
  })

  it('should set theme value to system when theme is SYSTEM', () => {
    const { setTheme } = useThemeStore.getState()
    setTheme({
      theme: EThemeBrowser.SYSTEM,
      themeValue: EThemeBrowser.LIGHT,
      color: EColors.GREEN,
    })
    expect(useThemeStore.getState().themeValue).toBe(EThemeBrowser.DARK)
  })
})
