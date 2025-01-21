import { TooltipProps } from '@mui/material'
import { TooltipMUI } from './styles'

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  return <TooltipMUI {...props}>{children}</TooltipMUI>
}
