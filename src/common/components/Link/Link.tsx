import { Link as LinkMUI, LinkProps } from '@mui/material'
import { ReactNode } from 'react'

interface ILinkProps extends LinkProps {
  children: ReactNode
}

export const Link = ({ children, ...props }: ILinkProps) => {
  return <LinkMUI {...props}>{children}</LinkMUI>
}
