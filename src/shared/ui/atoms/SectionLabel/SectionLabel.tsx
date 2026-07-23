import clsx from 'clsx'
import type { SectionLabelProps } from './SectionLabel.types'

export const SectionLabel = ({ children, className }: SectionLabelProps) => (
  <p
    className={clsx(
      'text-muted text-xs font-semibold tracking-wide uppercase',
      className
    )}
  >
    {children}
  </p>
)
