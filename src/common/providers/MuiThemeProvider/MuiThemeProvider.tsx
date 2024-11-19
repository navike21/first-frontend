import { useSystemTheme } from '@Hooks/useSystemTheme'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { useThemeStore } from '@Store/index'
import { navikeTheme } from '@Themes/navikeTheme'
import { ReactNode } from 'react'

type TMuiThemeProviderProps = {
  children: ReactNode
}

export const MuiThemeProvider = ({ children }: TMuiThemeProviderProps) => {
  useSystemTheme()

  const { themeValue, textSize } = useThemeStore((state) => state)

  const materialTheme = createTheme(
    navikeTheme({ themeMode: themeValue, textSize })
  )
  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
