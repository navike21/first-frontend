import { Button, styled } from '@mui/material'

export const MUIButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    position: 'relative',
    padding: theme.spacing(1, 2),
  },
}))

export const ContentLoader = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
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
  [theme.breakpoints.up('xs')]: {
    opacity: loading ? 0 : 1,
  },
}))
