import { styled } from '@mui/material'

export const HeaderComponent = styled('header')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2.5),
    position: 'sticky',
    top: 0,
  },
}))
