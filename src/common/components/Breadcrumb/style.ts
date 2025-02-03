import { Breadcrumbs, styled, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'

export const BreadcrumbsMUI = styled(Breadcrumbs)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    padding: theme.spacing(2, 0),
  },
}))

export const LinkBreadcrumb = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  transition: 'all 0.3s',
  '&:hover': {
    color: theme.palette.primary.main,
    transition: 'all 0.3s',
  },
}))

export const LastBreadcrumb = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
}))
