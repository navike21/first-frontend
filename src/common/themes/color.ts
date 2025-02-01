import {
  EBaseColor,
  EBlue,
  EColor,
  ECyan,
  EGray,
  EGreen,
  EOrange,
  EPink,
  EPurple,
  ERed,
  EYellow,
} from '@Enums/color'
import { EThemeOption } from '@Enums/themeOption'
import { Color, PaletteColor, TypeBackground } from '@mui/material'

type TColor = {
  [key in EColor]: PaletteColor
}

export const colors: TColor = {
  [EColor.BLUE]: {
    main: EBlue.BLUE_500,
    light: EBlue.BLUE_300,
    dark: EBlue.BLUE_700,
    contrastText: EBaseColor.WHITE,
  },
  [EColor.CYAN]: {
    main: ECyan.CYAN_500,
    light: ECyan.CYAN_200,
    dark: ECyan.CYAN_600,
    contrastText: EBaseColor.WHITE,
  },
  [EColor.GREEN]: {
    main: EGreen.GREEN_500,
    light: EGreen.GREEN_300,
    dark: EGreen.GREEN_700,
    contrastText: EBaseColor.BLACK,
  },
  [EColor.ORANGE]: {
    main: EOrange.ORANGE_500,
    light: EOrange.ORANGE_200,
    dark: EOrange.ORANGE_700,
    contrastText: EBaseColor.WHITE,
  },
  [EColor.PURPLE]: {
    main: EPurple.PURPLE_500,
    light: EPurple.PURPLE_300,
    dark: EPurple.PURPLE_700,
    contrastText: EBaseColor.WHITE,
  },
  [EColor.RED]: {
    main: ERed.RED_500,
    light: ERed.RED_300,
    dark: ERed.RED_700,
    contrastText: EBaseColor.WHITE,
  },
  [EColor.YELLOW]: {
    main: EYellow.YELLOW_700,
    light: EYellow.YELLOW_400,
    dark: EYellow.YELLOW_900,
    contrastText: EBaseColor.BLACK,
  },
  [EColor.PINK]: {
    main: EPink.PINK_400,
    light: EPink.PINK_200,
    dark: EPink.PINK_800,
    contrastText: EBaseColor.WHITE,
  },
}

export const backgroundColor = (
  themeMode: EThemeOption
): Partial<TypeBackground> => ({
  default: themeMode === EThemeOption.LIGHT ? EGray.GRAY_50 : EGray.GRAY_900,
  paper: themeMode === EThemeOption.LIGHT ? EBaseColor.WHITE : EGray.GRAY_900,
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
