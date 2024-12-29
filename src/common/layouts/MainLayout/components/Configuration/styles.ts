import { styled } from '@mui/material'
import { rotate } from '@Styles/animations'

export const ContentIconConfig = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'flex',
    animation: `${rotate} 5s linear infinite`,
  },
}))
