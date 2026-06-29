import type { ReactNode } from 'react'

export interface AccordionProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  icon?: ReactNode
  isOpen: boolean
  title: ReactNode
  onToggle: () => void
}
