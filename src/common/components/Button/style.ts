import { ESizes } from '@Enums/size'
import { Button, styled } from '@mui/material'

export const MUIButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    position: 'relative',
    padding: theme.spacing(1.5, 2),
  },
}))

export const ContentLoader = styled('div')(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}))

export const ContentButton = styled('div', {
  shouldForwardProp: (prop) => prop !== 'loading',
})<{
  loading?: boolean
}>(({ theme, loading }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    opacity: loading ? 0 : 1,
    display: 'flex',
  },
}))
