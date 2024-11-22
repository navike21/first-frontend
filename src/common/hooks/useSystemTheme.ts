import { EThemeBrowser } from '@Enums/browser'
import { useEffect } from 'react'
import { useTheme } from './useTheme'

export const useSystemTheme = () => {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === EThemeBrowser.SYSTEM)
        setTheme({
          theme: EThemeBrowser.SYSTEM,
          themeValue: e.matches ? EThemeBrowser.DARK : EThemeBrowser.LIGHT,
        })
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, setTheme])
}
