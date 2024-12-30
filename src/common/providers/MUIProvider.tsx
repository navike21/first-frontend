import { CssBaseline, ThemeProvider } from '@mui/material'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { createNavikeTheme } from '@Themes/navikeTheme'
import { ReactNode } from 'react'

type TMUIProviderProps = {
  children: ReactNode
}

export const MUIProvider = ({ children }: TMUIProviderProps) => {
  const { primaryColor, themeOption, textSize } = useOptionsBrowserStore()

  const materialTheme = createNavikeTheme({
    themeMode: themeOption,
    textSize,
    color: primaryColor,
  })

  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
