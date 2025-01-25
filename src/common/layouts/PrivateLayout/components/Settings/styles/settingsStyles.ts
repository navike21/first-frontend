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
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('xs')]: {
    flexWrap: 'wrap',
  },
  [theme.breakpoints.up('sm')]: {
    flexWrap: 'nowrap',
  },
}))

export const SectionDrawerPrimaryColor = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  width: '100%',
}))
