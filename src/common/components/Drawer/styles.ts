import { styled } from '@mui/material'

export const ContentDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: theme.typography.pxToRem(300),
  },
}))

export const HeaderDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
}))

export const TitleDrawer = styled('h6')(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: 'center',
  fontSize: theme.typography.pxToRem(20),
  margin: 0,
}))
