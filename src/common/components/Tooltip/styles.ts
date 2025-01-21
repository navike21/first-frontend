import { Paper, styled, Tooltip } from '@mui/material'

export const TooltipMUI = styled(Tooltip)(() => ({}))

export const TooltipInfo = styled(Paper)(({ theme, elevation = 2 }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(0.8, 1.5),
  borderRadius: theme.typography.pxToRem(5),
  fontSize: theme.typography.pxToRem(13),
  fontWeight: theme.typography.fontWeightBold,
  boxShadow: theme.shadows[elevation],
  '& .MuiTooltip-arrow': {
    color: theme.palette.grey[900],
  },
}))
