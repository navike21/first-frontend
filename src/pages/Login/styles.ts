import { TStyleProps } from '@Types/styles'
import background from '@Assets/images/background-3-blur.webp'
import { styled } from '@mui/material'

export const formContainer: TStyleProps = (theme) => ({
  [theme.breakpoints.up('xs')]: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    justifyContent: 'center',
    paddingY: theme.spacing(5),
    paddingX: theme.spacing(4),
    width: '80%',
    marginY: theme.spacing(5),
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(60),
  },
  [theme.breakpoints.up('md')]: {
    paddingY: theme.spacing(7),
  },
})

export const loginContainer: TStyleProps = () => ({
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
})

export const FormContainer = styled('form')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: '100%',
    maxWidth: theme.spacing(35),
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(40),
  },
}))
