import type { ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}
