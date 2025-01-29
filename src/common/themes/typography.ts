import { ESizes } from '@Enums/size'
import { Theme } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import { TITLE_FONT } from '@Constants/fontFamily'

export const typography = (baseTheme: Theme): TypographyOptions => ({
  h1: {
    ...baseTheme.typography.h1,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(36),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(36),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(38),
    },
  },
  h2: {
    ...baseTheme.typography.h2,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(34),
    },
  },
  h3: {
    ...baseTheme.typography.h3,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(28),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(28),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(30),
    },
  },
  h4: {
    ...baseTheme.typography.h4,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(24),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(24),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(26),
    },
  },
  h5: {
    ...baseTheme.typography.h5,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(20),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(20),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(22),
    },
  },
  h6: {
    ...baseTheme.typography.h6,
    fontWeight: 600,
    fontFamily: TITLE_FONT,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(18),
    },
  },
  body1: {
    ...baseTheme.typography.body1,
    fontWeight: 500,
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
  },
  button: {
    ...baseTheme.typography.button,
    fontFamily: TITLE_FONT,
    fontWeight: 600,
    textTransform: 'none',
    [baseTheme.breakpoints.up(ESizes.XS)]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
    [baseTheme.breakpoints.up(ESizes.SM)]: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
  },
})
