import type { ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ModalAnimationType = 'spring' | 'slide' | 'fade'

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
  animationType?: ModalAnimationType
}
