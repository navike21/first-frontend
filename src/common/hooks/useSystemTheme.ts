import { EThemeBrowser } from '@Enums/browser'
import { useEffect } from 'react'
import { useTheme } from './useTheme'

export const useSystemTheme = () => {
  const { theme, setTheme, color } = useTheme()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    if (theme !== EThemeBrowser.SYSTEM) return

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === EThemeBrowser.SYSTEM)
        setTheme({
          theme: EThemeBrowser.SYSTEM,
          themeValue: e.matches ? EThemeBrowser.DARK : EThemeBrowser.LIGHT,
          color,
        })
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [color, theme, setTheme])
}
