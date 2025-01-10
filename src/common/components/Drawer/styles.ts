import { styled } from '@mui/material'

export const ContentDrawer = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    maxWidth: theme.typography.pxToRem(450),
    minWidth: theme.typography.pxToRem(300),
    width: '80vw',
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

export const ContentActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
}))
