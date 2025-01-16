import { IconButton as IconButtonMUI, IconButtonProps } from '@mui/material'

export const IconButton = ({ children, ...props }: IconButtonProps) => (
  <IconButtonMUI {...props}>{children}</IconButtonMUI>
)
