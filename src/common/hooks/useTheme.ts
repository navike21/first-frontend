import { useThemeStore } from '@Store/config'

export const useTheme = () => {
  const color = useThemeStore.getState().color
  const language = useThemeStore.getState().language
  const theme = useThemeStore.getState().theme
  const themeValue = useThemeStore.getState().themeValue
  const textSize = useThemeStore.getState().textSize
  const setLanguage = useThemeStore.getState().setLanguage
  const setTheme = useThemeStore.getState().setTheme
  const setTextSize = useThemeStore.getState().setTextSize
  const toggleTheme = useThemeStore.getState().toggleTheme

  return {
    color,
    language,
    theme,
    themeValue,
    textSize,
    setLanguage,
    setTheme,
    setTextSize,
    toggleTheme,
  }
}
