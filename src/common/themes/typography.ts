import { Theme } from '@mui/material'
import { TypographyOptions } from '@mui/material/styles/createTypography'

export const typography = (baseTheme: Theme): TypographyOptions => ({
  h1: {
    ...baseTheme.typography.h1,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(36),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(40),
    },
  },
  h2: {
    ...baseTheme.typography.h2,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(28),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(36),
    },
  },
  h3: {
    ...baseTheme.typography.h3,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      margin: 0,
      padding: 0,
      fontSize: baseTheme.typography.pxToRem(24),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(28),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(32),
    },
  },
  h4: {
    ...baseTheme.typography.h4,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(20),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(24),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(26),
    },
  },
  h5: {
    ...baseTheme.typography.h5,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(19),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(20),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(22),
    },
  },
  h6: {
    ...baseTheme.typography.h6,
    fontWeight: 700,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(18),
    },
  },
  subtitle1: {
    ...baseTheme.typography.subtitle1,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(10),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(12),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
  },
  subtitle2: {
    ...baseTheme.typography.subtitle2,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(8),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(10),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(12),
    },
  },
  caption: {
    ...baseTheme.typography.caption,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(8),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(10),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(12),
    },
  },
  body1: {
    ...baseTheme.typography.body1,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(14),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(16),
    },
  },
  body2: {
    ...baseTheme.typography.body2,
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(8),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(10),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(12),
    },
  },
  button: {
    ...baseTheme.typography.button,
    fontWeight: 700,
    // textTransform: 'none',
    [baseTheme.breakpoints.up('xs')]: {
      fontSize: baseTheme.typography.pxToRem(13),
      padding: baseTheme.typography.pxToRem(12),
    },
    [baseTheme.breakpoints.up('sm')]: {
      fontSize: baseTheme.typography.pxToRem(14),
      padding: baseTheme.typography.pxToRem(10),
    },
    [baseTheme.breakpoints.up('md')]: {
      fontSize: baseTheme.typography.pxToRem(14),
      padding: baseTheme.typography.pxToRem(9),
    },
  },
})
