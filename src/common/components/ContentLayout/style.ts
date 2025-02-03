import { ESize } from '@Enums/size'
import { styled } from '@mui/material'

export const Content = styled('section')(({ theme }) => ({
  [theme.breakpoints.up(ESize.XS)]: {
    padding: theme.spacing(2, 0),
    // maxWidth: theme.breakpoints.values.lg,
    width: '85%',
    margin: '0 auto',
  },
  [theme.breakpoints.up(ESize.MD)]: {
    padding: theme.spacing(3, 0),
  },
}))
