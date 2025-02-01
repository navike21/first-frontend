import { EColor } from '@Enums/color'
import { createTheme, ThemeOptions } from '@mui/material'
import { backgroundColor, colors, grayColors } from './color'
import { EThemeOption } from '@Enums/themeOption'
import { ESize } from '@Enums/size'
// import { htmlFontSize } from './htmlFontSize'
import { typography } from './typography'
import { htmlFontSize } from './htmlFontSize'
import { TEXT_FONT } from '@Constants/fontFamily'
import { components } from './components'

type TMaterialTheme = {
  themeMode: EThemeOption
  color: EColor
}

type TAdditionalTheme = {
  textSize: ESize
}

type TCreateNavikeTheme = TMaterialTheme & TAdditionalTheme

export const navikeTheme = ({
  themeMode,
  color,
  textSize,
}: TCreateNavikeTheme): ThemeOptions => ({
  palette: {
    mode: themeMode,
    primary: colors[color],
    background: backgroundColor(themeMode),
    grey: grayColors,
  },
  typography: {
    fontFamily: TEXT_FONT,
    htmlFontSize: htmlFontSize[textSize],
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 340,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})

export const createNavikeTheme = (themeOptions: TCreateNavikeTheme) => {
  const baseTheme = createTheme(navikeTheme(themeOptions))
  baseTheme.typography = {
    ...baseTheme.typography,
    ...typography(baseTheme),
  }
  baseTheme.components = {
    ...baseTheme.components,
    ...components(baseTheme),
  }

  return baseTheme
}
