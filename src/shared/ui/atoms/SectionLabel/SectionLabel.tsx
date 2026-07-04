import clsx from 'clsx'
import type { SectionLabelProps } from './SectionLabel.types'

export const SectionLabel = ({ children, className }: SectionLabelProps) => (
  <p
    className={clsx(
      'text-xs font-semibold tracking-wide text-muted uppercase',
      className
    )}
  >
    {children}
  </p>
)
