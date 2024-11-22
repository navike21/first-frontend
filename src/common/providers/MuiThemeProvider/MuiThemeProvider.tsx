import { useSystemTheme } from '@Hooks/useSystemTheme'
import { useTheme } from '@Hooks/useTheme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createNavikeTheme } from '@Themes/navikeTheme'
import { ReactNode } from 'react'

type TMuiThemeProviderProps = {
  children: ReactNode
}

export const MuiThemeProvider = ({ children }: TMuiThemeProviderProps) => {
  useSystemTheme()

  const { themeValue, textSize, color } = useTheme()

  const materialTheme = createNavikeTheme({
    themeMode: themeValue,
    textSize,
    color,
  })
  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
