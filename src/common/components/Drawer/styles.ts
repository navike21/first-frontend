import { ESizes } from '@Enums/size'
import { EThemeOption } from '@Enums/themeOption'
import { Drawer, styled } from '@mui/material'

export const DrawerMUI = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    '& .MuiDrawer-paper': {
      backdropFilter: 'blur(10px)',
      backgroundColor:
        theme.palette.mode === EThemeOption.LIGHT
          ? `rgba(255, 255, 255, 0.90)`
          : `rgba(20, 26, 33 , 0.90)`,
      borderLeft: `${theme.palette.divider} solid 1px`,
    },
  },
}))

export const ContentDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    maxWidth: 380,
    minWidth: 300,
    width: '90vw',
    height: '100%',
  },
}))

export const HeaderDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
}))

export const ContentActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
}))
