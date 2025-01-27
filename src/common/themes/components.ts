import { Components, Theme } from '@mui/material'

export const components = (baseTheme: Theme): Components => ({
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: baseTheme.palette.common.black,
        color: baseTheme.palette.common.white,
        padding: baseTheme.spacing(0.8, 2),
        borderRadius: baseTheme.typography.pxToRem(5),
        fontSize: baseTheme.typography.pxToRem(13),
        fontWeight: baseTheme.typography.fontWeightBold,
        boxShadow: baseTheme.shadows[2],
        '& .MuiTooltip-arrow': {
          color: baseTheme.palette.grey[900],
        },
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      thumb: {
        width: 18,
        height: 18,
        backgroundColor: baseTheme.palette.primary.main,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          width: 22,
          height: 22,
        },
        '&:active': {
          width: 18,
          height: 18,
        },
      },
      rail: {
        height: 10,
        backgroundColor: baseTheme.palette.grey[500],
      },
      track: {
        height: 10,
        transition: 'all 0.3s ease-in-out',
      },
      valueLabel: {
        fontSize: baseTheme.typography.pxToRem(13),
        backgroundColor: baseTheme.palette.common.black,
        color: baseTheme.palette.common.white,
        borderRadius: baseTheme.typography.pxToRem(5),
        padding: baseTheme.spacing(0.8, 2),
        boxShadow: baseTheme.shadows[2],
      },
      mark: {
        width: 2,
        height: 6,
        backgroundColor: baseTheme.palette.background.paper,
        transform: 'translate(0%, -50%)',
        opacity: 0.5,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        width: '100%',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
      },
    },
  },
  MuiModal: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
      },
      backdrop: {
        backgroundColor: 'transparent',
      },
    },
  },
})
