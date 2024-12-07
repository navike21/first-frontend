import { useThemeStore } from '@Store/config'

export const useTheme = () => {
  const color = useThemeStore((state) => state.color)
  const language = useThemeStore((state) => state.language)
  const theme = useThemeStore((state) => state.theme)
  const themeValue = useThemeStore((state) => state.themeValue)
  const textSize = useThemeStore((state) => state.textSize)
  const setLanguage = useThemeStore((state) => state.setLanguage)
  const setTheme = useThemeStore((state) => state.setTheme)
  const setTextSize = useThemeStore((state) => state.setTextSize)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return {
    color,
    language,
    theme,
    themeValue,
    textSize,
    setLanguage,
    setTheme,
    toggleTheme,
    setTextSize,
  }
}
