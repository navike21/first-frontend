import { styled } from '@mui/material'

export const HeaderContent = styled('header')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    alignItems: 'center',
    display: 'flex',
    height: theme.typography.pxToRem(70),
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
  },
}))

export const LogoContent = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    gap: theme.spacing(1),
  },
}))

export const Navigation = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(1),
  },
}))
