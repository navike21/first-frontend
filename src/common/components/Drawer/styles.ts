import { EThemeOption } from '@Enums/themeOption'
import { Drawer, styled } from '@mui/material'

export const DrawerMUI = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'themeOption',
})<{
  themeOption: EThemeOption
}>(({ theme, themeOption }) => ({
  [theme.breakpoints.up('xs')]: {
    '& .MuiDrawer-paper': {
      backdropFilter: 'blur(10px)',
      backgroundColor:
        themeOption === EThemeOption.LIGHT
          ? `rgba(255, 255, 255, 0.90)`
          : `rgba(20, 26, 33 , 0.90)`,
      borderLeft: `${theme.palette.divider} solid 1px`,
    },
  },
}))

export const ContentDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    maxWidth: 380,
    minWidth: 300,
    width: '90vw',
  },
}))

export const HeaderDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
}))

export const ContentActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
}))
