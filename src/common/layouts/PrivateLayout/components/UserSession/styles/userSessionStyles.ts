import { styled, Typography } from '@mui/material'

export const ContentDrawerUserSession = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  height: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
}))

export const InfoUserSessionContent = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  height: '100%',
}))

export const InfoUserSession = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0),
}))

export const UserSessionName = styled(Typography)(() => ({
  margin: 0,
  fontWeight: 700,
}))

export const UserSessionEmail = styled(Typography)(() => ({
  opacity: 0.7,
}))

export const ActionsProfile = styled('aside')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}))
