import type { ReactNode } from 'react'
import type { PageHeaderAction } from '@/shared/ui/molecules/PageHeader'

export interface PageContentProps {
  /** Page title rendered in the header and floating bar */
  title: string
  /** Optional description below the title */
  description?: string
  /** Action buttons rendered in the header and floating bar */
  actions?: PageHeaderAction[]
  /** Page content */
  children: ReactNode
  /** Additional className for the content wrapper */
  className?: string
}
