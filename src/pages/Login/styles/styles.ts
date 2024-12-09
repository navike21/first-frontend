import background from '@Assets/images/background-3-blur.webp'
import { Grid2 as Grid, Paper, styled } from '@mui/material'

export const LoginContainer = styled(Grid)(() => ({
  minHeight: '100dvh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.1,
    zIndex: -1,
  },
}))

export const FormContainer = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    justifyContent: 'center',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    width: '80%',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(52),
  },
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(7),
  },
}))

export const FormLogin = styled('form')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '100%',
    maxWidth: theme.spacing(35),
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(40),
  },
}))
