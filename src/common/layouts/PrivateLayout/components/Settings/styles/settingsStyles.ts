import { styled } from '@mui/material'

export const ContentDrawerSettings = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}))

export const SectionDrawerSettings = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  width: '100%',
}))
