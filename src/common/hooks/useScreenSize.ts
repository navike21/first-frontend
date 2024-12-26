import { EScreenSize } from '@Enums/sizes'
import { useMediaQuery, useTheme } from '@mui/material'

export const useScreenSize = (): EScreenSize => {
  const theme = useTheme()

  const matches = {
    [EScreenSize.XS]: useMediaQuery(theme.breakpoints.only(EScreenSize.XS)),
    [EScreenSize.SM]: useMediaQuery(theme.breakpoints.only(EScreenSize.SM)),
    [EScreenSize.MD]: useMediaQuery(theme.breakpoints.only(EScreenSize.MD)),
    [EScreenSize.LG]: useMediaQuery(theme.breakpoints.only(EScreenSize.LG)),
    [EScreenSize.XL]: useMediaQuery(theme.breakpoints.only(EScreenSize.XL)),
  }

  return Object.entries(matches).find(
    ([, isMatch]) => isMatch
  )?.[0] as EScreenSize
}
