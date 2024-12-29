import { createTheme, ThemeOptions } from '@mui/material'
import { TMaterialTheme } from '@Types/index'
import { htmlFontSize } from './htmlFontSize'
import { typography } from './typography'
import { backgroundColor, colors, grayColors } from './colors'

export const navikeTheme = ({
  themeMode,
  textSize,
  color,
}: TMaterialTheme): ThemeOptions => ({
  palette: {
    mode: themeMode,
    primary: colors[color],
    background: backgroundColor(themeMode),
    grey: grayColors,
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    htmlFontSize: htmlFontSize[textSize],
  },
})

export const createNavikeTheme = (themeOptions: TMaterialTheme) => {
  const baseTheme = createTheme(navikeTheme(themeOptions))
  baseTheme.typography = {
    ...baseTheme.typography,
    ...typography(baseTheme),
  }

  return baseTheme
}
