import { IconButton as IconButtonMUI, IconButtonOwnProps } from '@mui/material'

export const IconButton = ({ children, ...props }: IconButtonOwnProps) => (
  <IconButtonMUI {...props}>{children}</IconButtonMUI>
)
