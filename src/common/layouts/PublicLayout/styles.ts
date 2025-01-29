import { ESizes } from '@Enums/size'
import { Grid2, styled } from '@mui/material'

export const ContainerLayout = styled(Grid2)(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100dvh',
    padding: theme.spacing(2),
    width: '100%',
  },
}))
