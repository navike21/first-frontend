import { vi } from 'vitest'
import { useThemeStore } from '@Store/index'
import { EColors } from '@Enums/color'
import { ESizes } from '@Enums/sizes'
import { EThemeBrowser } from '@Enums/browser'
import { getItemLocalStorageObject } from '@Utils/localStorage'
import { initializeTheme } from '@Helpers/initializeTheme'

vi.mock('@Store/index', () => ({
  useThemeStore: {
    getState: vi.fn(),
  },
  STORAGE_KEY_THEME_STORE: 'theme-storage',
}))

vi.mock('@Utils/localStorage', () => ({
  getItemLocalStorageObject: vi.fn(),
}))

describe('initializeTheme', () => {
  const setTheme = vi.fn()
  const setTextSize = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useThemeStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      setTheme,
      setTextSize,
    })
  })

  test('sets default values when localStorage is empty', () => {
    ;(getItemLocalStorageObject as ReturnType<typeof vi.fn>).mockReturnValue({})

    initializeTheme()

    // Asegúrate de que 'themeValue' tenga el valor correcto por defecto
    expect(setTheme).toHaveBeenCalledWith({
      theme: EThemeBrowser.SYSTEM,
      themeValue: EThemeBrowser.LIGHT, // Este valor debería ser correcto ahora
      color: EColors.GREEN,
    })
    expect(setTextSize).toHaveBeenCalledWith(ESizes.MD)
  })

  test('sets values from localStorage when present', () => {
    ;(getItemLocalStorageObject as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: EThemeBrowser.DARK,
      textSize: ESizes.LG,
      color: EColors.BLUE,
      themeValue: EThemeBrowser.DARK, // Asegúrate de que 'themeValue' esté presente en el mock
    })

    initializeTheme()

    expect(setTheme).toHaveBeenCalledWith({
      theme: EThemeBrowser.DARK,
      themeValue: EThemeBrowser.DARK,
      color: EColors.BLUE,
    })
    expect(setTextSize).toHaveBeenCalledWith(ESizes.LG)
  })
})
