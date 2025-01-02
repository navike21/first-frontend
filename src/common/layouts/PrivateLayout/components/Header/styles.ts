import { styled } from '@mui/material'

export const HeaderContent = styled('header')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    alignItems: 'center',
    display: 'flex',
    height: theme.typography.pxToRem(70),
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },
}))

export const LogoContent = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    gap: theme.spacing(2),
  },
}))

export const Navigation = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    gap: theme.spacing(2),
  },
}))
