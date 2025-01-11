import { Paper, styled, Typography } from '@mui/material'

export const IconSwitchContent = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  width: '100%',
}))

export const IconSwitchSection = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  width: '100%',
}))

export const IconSwitchTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: theme.typography.pxToRem(10),
  color: theme.palette.text.primary,
}))
