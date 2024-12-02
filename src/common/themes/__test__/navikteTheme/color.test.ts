import { describe, it, expect } from 'vitest'
import { backgroundColor, colors, grayColors } from '../../navikeTheme/colors'
import {
  EBaseColors,
  EBlue,
  ECyan,
  EGray,
  EGreen,
  EOrange,
  EPurple,
  ERed,
} from '@Enums/color'
import { EThemeBrowser } from '@Enums/browser'

describe('colors', () => {
  it('should return colors', () => {
    expect(colors).toEqual({
      blue: {
        main: EBlue.BLUE_500,
        light: EBlue.BLUE_300,
        dark: EBlue.BLUE_700,
        contrastText: EBaseColors.WHITE,
      },
      cyan: {
        main: ECyan.CYAN_500,
        light: ECyan.CYAN_300,
        dark: ECyan.CYAN_700,
        contrastText: EBaseColors.WHITE,
      },
      green: {
        main: EGreen.GREEN_500,
        light: EGreen.GREEN_300,
        dark: EGreen.GREEN_700,
        contrastText: EBaseColors.BLACK,
      },
      orange: {
        main: EOrange.ORANGE_500,
        light: EOrange.ORANGE_300,
        dark: EOrange.ORANGE_700,
        contrastText: EBaseColors.WHITE,
      },
      purple: {
        main: EPurple.PURPLE_500,
        light: EPurple.PURPLE_300,
        dark: EPurple.PURPLE_700,
        contrastText: EBaseColors.WHITE,
      },
      red: {
        main: ERed.RED_500,
        light: ERed.RED_300,
        dark: ERed.RED_700,
        contrastText: EBaseColors.WHITE,
      },
    })
  })
})

describe('backgroundColor', () => {
  it('should return background color', () => {
    expect(backgroundColor(EThemeBrowser.LIGHT)).toEqual({
      paper: EBaseColors.WHITE,
      default: EGray.GRAY_50,
    })
    expect(backgroundColor(EThemeBrowser.DARK)).toEqual({
      paper: EGray.GRAY_900,
      default: EGray.GRAY_900,
    })
  })
})

describe('grayColors', () => {
  it('should return gray colors', () => {
    expect(grayColors).toEqual({
      50: EGray.GRAY_50,
      100: EGray.GRAY_100,
      200: EGray.GRAY_200,
      300: EGray.GRAY_300,
      400: EGray.GRAY_400,
      500: EGray.GRAY_500,
      600: EGray.GRAY_600,
      700: EGray.GRAY_700,
      800: EGray.GRAY_800,
      900: EGray.GRAY_900,
    })
  })
})
