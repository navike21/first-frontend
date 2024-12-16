import { ReactNode } from 'react'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'

export interface IButtonProps extends LoadingButtonProps {
  children: ReactNode
}

export const Button = ({
  children,
  size = 'small',
  variant = 'contained',
  ...props
}: IButtonProps) => (
  <LoadingButton size={size} variant={variant} {...props}>
    {children}
  </LoadingButton>
)
