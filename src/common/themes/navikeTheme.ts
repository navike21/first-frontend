import { ESizes } from '@Enums/sizes'
import { ThemeOptions } from '@mui/material'
import { TMaterialTheme } from '@Types/theme'

const htmlFontSize = {
  [ESizes.XS]: 20,
  [ESizes.SM]: 18,
  [ESizes.MD]: 16,
  [ESizes.LG]: 12,
  [ESizes.XL]: 10,
  [ESizes.XXL]: 8,
  [ESizes.XXXL]: 6,
}

export const navikeTheme = ({
  themeMode,
  textSize,
}: TMaterialTheme): ThemeOptions => ({
  direction: 'rtl',
  palette: {
    mode: themeMode,
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    htmlFontSize: htmlFontSize[textSize],
  },
})
