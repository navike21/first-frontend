import { styled } from '@mui/material'

export const ContentDrawerSettings = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}))

export const SectionDrawerSettings = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
}))

export const SectionDrawerPrimaryColor = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
}))
