import { useThemeStore } from '@Store/config'

export const useTheme = () => {
  const color = useThemeStore((state) => state.color)
  const theme = useThemeStore((state) => state.theme)
  const themeValue = useThemeStore((state) => state.themeValue)
  const textSize = useThemeStore((state) => state.textSize)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTextSize = useThemeStore((state) => state.setTextSize)

  return {
    color,
    theme,
    themeValue,
    textSize,
    setTheme,
    toggleTheme,
    setTextSize,
  }
}
