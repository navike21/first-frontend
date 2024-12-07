import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { useTheme } from '../useTheme'
import { ITheme, useThemeStore } from '@Store/config'
import { ESizes } from '@Enums/sizes'
import { EThemeBrowser } from '@Enums/browser'
import { ELanguages } from '@Enums/language'

vi.mock('@Store/config', () => ({
  useThemeStore: vi.fn(),
}))

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the correct initial values from the store', () => {
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        color: 'blue',
        language: 'en',
        theme: 'light',
        themeValue: 'default',
        textSize: 'medium',
        setTheme: vi.fn(),
        toggleTheme: vi.fn(),
        setTextSize: vi.fn(),
        setLanguage: vi.fn(),
      }
      return selector(state)
    })

    const {
      color,
      language,
      theme,
      themeValue,
      textSize,
      setLanguage,
      setTheme,
      toggleTheme,
      setTextSize,
    } = useTheme()

    expect(color).toBe('blue')
    expect(language).toBe('en')
    expect(theme).toBe('light')
    expect(themeValue).toBe('default')
    expect(textSize).toBe('medium')
    expect(setLanguage).toBeInstanceOf(Function)
    expect(setTheme).toBeInstanceOf(Function)
    expect(toggleTheme).toBeInstanceOf(Function)
    expect(setTextSize).toBeInstanceOf(Function)
  })

  it('should call setTheme when setTheme is invoked', () => {
    const setThemeMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        setTheme: setThemeMock,
      }
      return selector(state)
    })

    const { setTheme } = useTheme()
    setTheme({ theme: EThemeBrowser.DARK } as ITheme)

    expect(setThemeMock).toHaveBeenCalledWith({
      theme: EThemeBrowser.DARK,
    } as ITheme)
  })

  it('should call toggleTheme when toggleTheme is invoked', () => {
    const toggleThemeMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        toggleTheme: toggleThemeMock,
      }
      return selector(state)
    })

    const { toggleTheme } = useTheme()
    toggleTheme()

    expect(toggleThemeMock).toHaveBeenCalled()
  })

  it('should call setTextSize when setTextSize is invoked', () => {
    const setTextSizeMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        setTextSize: setTextSizeMock,
      }
      return selector(state)
    })

    const { setTextSize } = useTheme()
    setTextSize(ESizes.LG)

    expect(setTextSizeMock).toHaveBeenCalledWith(ESizes.LG)
  })

  it('should toggle the theme between light and dark', () => {
    const initialState = {
      theme: EThemeBrowser.LIGHT,
      toggleTheme: vi.fn(),
    }

    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      return selector(initialState)
    })

    const { toggleTheme } = useTheme()
    toggleTheme()
    expect(initialState.toggleTheme).toHaveBeenCalled()
    initialState.theme = EThemeBrowser.DARK
    expect(initialState.theme).toBe(EThemeBrowser.DARK)
  })

  it('should handle invalid input for setTextSize', () => {
    const setTextSizeMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        setTextSize: setTextSizeMock,
      }
      return selector(state)
    })

    const { setTextSize } = useTheme()

    const invalidSize = 'invalid-size' as unknown as ESizes
    setTextSize(invalidSize)
    expect(setTextSizeMock).toHaveBeenCalledWith(invalidSize)
  })

  it('should call setLanguage when setLanguage is invoked', () => {
    const setLanguageMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        setLanguage: setLanguageMock,
      }
      return selector(state)
    })

    const { setLanguage } = useTheme()
    setLanguage(ELanguages.ES)

    expect(setLanguageMock).toHaveBeenCalledWith('es')
  })

  it('should handle invalid input for setLanguage', () => {
    const setLanguageMock = vi.fn()
    ;(useThemeStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        setLanguage: setLanguageMock,
      }
      return selector(state)
    })

    const { setLanguage } = useTheme()

    const invalidLanguage = 'invalid-language' as unknown as ELanguages
    setLanguage(invalidLanguage)
    expect(setLanguageMock).toHaveBeenCalledWith(invalidLanguage)
  })
})
