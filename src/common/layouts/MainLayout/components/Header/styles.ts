import { styled } from '@mui/material'

export const HeaderComponent = styled('header')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2.5),
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
}))

export const NavigationHeader = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
  },
}))
