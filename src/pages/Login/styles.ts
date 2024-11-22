import styled from '@emotion/styled'
import { TStyleProps } from '@Types/styles'
import background from '@Assets/images/background-3-blur.webp'

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
    width: '80%',
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: theme.spacing(60),
  },
  [theme.breakpoints.up('md')]: {
    paddingY: theme.spacing(7),
  },
})

export const loginContainer: TStyleProps = () => ({
  height: '100dvh',
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
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.1,
    zIndex: -1,
  },
})

export const FormContainer = styled('form')({
  width: '70%',
})
