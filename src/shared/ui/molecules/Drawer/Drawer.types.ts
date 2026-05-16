import type { ReactNode } from 'react'

export interface DrawerProps {
  /** Specifies if the drawer is open */
  isOpen: boolean
  /** Function to call when the drawer should be closed (e.g., clicking the backdrop) */
  onClose: () => void
  /** The origin from which the drawer will slide in */
  placement?: 'left' | 'right'
  /** The title of the drawer, can be a string, a logo, or any ReactNode */
  title?: ReactNode
  /** The content of the drawer */
  children: ReactNode
  /** Additional class names for the drawer container */
  className?: string
  /** Additional class names for the backdrop */
  backdropClassName?: string
  /** Specifies if the drawer should only act as a mobile overlay using Tailwind responsive classes (e.g., hiding backdrop on md) */
  isMobileOnly?: boolean
}
