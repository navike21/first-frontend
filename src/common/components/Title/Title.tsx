import { Typography, TypographyOwnProps } from '@mui/material'
import { ReactNode } from 'react'

interface ITitleProps extends TypographyOwnProps {
  children: ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const Title = ({ children, variant = 'h3' }: ITitleProps) => (
  <Typography variant={variant}>{children}</Typography>
)
