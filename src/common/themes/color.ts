import {
  EBaseColors,
  EBlue,
  EColors,
  ECyan,
  EGray,
  EGreen,
  EOrange,
  EPurple,
  ERed,
  EYellow,
} from '@Enums/color'
import { EThemeOption } from '@Enums/themeOption'
import { Color, PaletteColor, TypeBackground } from '@mui/material'

type TColor = {
  [key in EColors]: PaletteColor
}

export const colors: TColor = {
  [EColors.BLUE]: {
    main: EBlue.BLUE_500,
    light: EBlue.BLUE_300,
    dark: EBlue.BLUE_700,
    contrastText: EBaseColors.WHITE,
  },
  [EColors.CYAN]: {
    main: ECyan.CYAN_500,
    light: ECyan.CYAN_300,
    dark: ECyan.CYAN_700,
    contrastText: EBaseColors.WHITE,
  },
  [EColors.GREEN]: {
    main: EGreen.GREEN_500,
    light: EGreen.GREEN_300,
    dark: EGreen.GREEN_700,
    contrastText: EBaseColors.BLACK,
  },
  [EColors.ORANGE]: {
    main: EOrange.ORANGE_500,
    light: EOrange.ORANGE_300,
    dark: EOrange.ORANGE_700,
    contrastText: EBaseColors.WHITE,
  },
  [EColors.PURPLE]: {
    main: EPurple.PURPLE_500,
    light: EPurple.PURPLE_400,
    dark: EPurple.PURPLE_600,
    contrastText: EBaseColors.WHITE,
  },
  [EColors.RED]: {
    main: ERed.RED_500,
    light: ERed.RED_300,
    dark: ERed.RED_700,
    contrastText: EBaseColors.WHITE,
  },
  [EColors.YELLOW]: {
    main: EYellow.YELLOW_500,
    light: EYellow.YELLOW_300,
    dark: EYellow.YELLOW_700,
    contrastText: EBaseColors.BLACK,
  },
}

export const backgroundColor = (
  themeMode: EThemeOption
): Partial<TypeBackground> => ({
  default: themeMode === EThemeOption.LIGHT ? EGray.GRAY_50 : EGray.GRAY_900,
  paper: themeMode === EThemeOption.LIGHT ? EBaseColors.WHITE : EGray.GRAY_900,
})

export const grayColors: Partial<Color> = {
  '50': EGray.GRAY_50,
  '100': EGray.GRAY_100,
  '200': EGray.GRAY_200,
  '300': EGray.GRAY_300,
  '400': EGray.GRAY_400,
  '500': EGray.GRAY_500,
  '600': EGray.GRAY_600,
  '700': EGray.GRAY_700,
  '800': EGray.GRAY_800,
  '900': EGray.GRAY_900,
}
