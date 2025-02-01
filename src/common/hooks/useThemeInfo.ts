import { ESize } from '@Enums/size'
import { Palette, useMediaQuery, useTheme } from '@mui/material'
import { Typography } from '@mui/material/styles/createTypography'

type TThemeInfo = {
  colors: Palette
  typography: Typography
  breakpoints: TBreakpoints
}

type TBreakpoints = {
  [ESize.XS]: boolean
  [ESize.SM]: boolean
  [ESize.MD]: boolean
  [ESize.LG]: boolean
  [ESize.XL]: boolean
}

export const useThemeInfo = (): TThemeInfo => {
  const { palette, typography, breakpoints } = useTheme()

  return {
    colors: palette,
    typography,
    breakpoints: {
      [ESize.XS]: useMediaQuery(breakpoints.only(ESize.XS)),
      [ESize.SM]: useMediaQuery(breakpoints.only(ESize.SM)),
      [ESize.MD]: useMediaQuery(breakpoints.only(ESize.MD)),
      [ESize.LG]: useMediaQuery(breakpoints.only(ESize.LG)),
      [ESize.XL]: useMediaQuery(breakpoints.only(ESize.XL)),
    },
  }
}
