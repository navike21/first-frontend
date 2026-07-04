import clsx from 'clsx'
import type { FormGridProps } from './FormGrid.types'

export const FormGrid = ({ children, className, hidden }: FormGridProps) => (
  <div
    hidden={hidden}
    className={clsx('grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2', className)}
  >
    {children}
  </div>
)
