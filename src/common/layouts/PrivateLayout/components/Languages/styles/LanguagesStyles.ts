import { Avatar, styled } from '@mui/material'

export const ContentAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.typography.pxToRem(30),
  height: theme.typography.pxToRem(30),
}))

export const IconFlag = styled('img')(({ theme }) => ({
  width: theme.typography.pxToRem(20),
  height: theme.typography.pxToRem(20),
  marginRight: theme.spacing(1),
}))
