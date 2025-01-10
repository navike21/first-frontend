import { ESizes } from '@Enums/size'
import { Palette, useMediaQuery, useTheme } from '@mui/material'
import { Typography } from '@mui/material/styles/createTypography'

type TThemeInfo = {
  colors: Palette
  typography: Typography
  breakpoints: TBreakpoints
}

type TBreakpoints = {
  [ESizes.XS]: boolean
  [ESizes.SM]: boolean
  [ESizes.MD]: boolean
  [ESizes.LG]: boolean
  [ESizes.XL]: boolean
}

export const useThemeInfo = (): TThemeInfo => {
  const { palette, typography, breakpoints } = useTheme()

  return {
    colors: palette,
    typography,
    breakpoints: {
      [ESizes.XS]: useMediaQuery(breakpoints.only(ESizes.XS)),
      [ESizes.SM]: useMediaQuery(breakpoints.only(ESizes.SM)),
      [ESizes.MD]: useMediaQuery(breakpoints.only(ESizes.MD)),
      [ESizes.LG]: useMediaQuery(breakpoints.only(ESizes.LG)),
      [ESizes.XL]: useMediaQuery(breakpoints.only(ESizes.XL)),
    },
  }
}
