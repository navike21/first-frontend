import { EColors } from '@Enums/color'
import { createTheme, ThemeOptions } from '@mui/material'
import { backgroundColor, colors, grayColors } from './color'
import { EThemeOption } from '@Enums/themeOption'
import { ESizes } from '@Enums/size'
import { htmlFontSize } from './htmlFontSize'
import { typography } from './typography'

export type TMaterialTheme = {
  themeMode: EThemeOption
  textSize: ESizes
  color: EColors
}

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
