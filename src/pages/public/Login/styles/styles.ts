import { ESizes } from '@Enums/size'
import { Paper, styled } from '@mui/material'

export const LoginBackground = styled('div')(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
}))

export const FormContainer = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    justifyContent: 'center',
    padding: theme.spacing(6, 5),
    width: '90%',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  [theme.breakpoints.up(ESizes.SM)]: {
    maxWidth: theme.spacing(50),
  },
}))

export const FormLogin = styled('form')(({ theme }) => ({
  [theme.breakpoints.up(ESizes.XS)]: {
    width: '100%',
    maxWidth: theme.spacing(35),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  [theme.breakpoints.up(ESizes.SM)]: {
    maxWidth: theme.spacing(40),
  },
}))
