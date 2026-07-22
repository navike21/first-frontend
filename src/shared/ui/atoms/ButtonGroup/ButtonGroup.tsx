import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface ButtonGroupProps {
  children: ReactNode
  className?: string
}

/**
 * Responsive layout for a row of action buttons (modal/form footers, bulk-
 * selection toolbars): 2 buttons stay side by side even on mobile; 3 or more
 * stack full-width on mobile and become a row from `sm:` up. The count is
 * detected via `:has()` so callers never pass a count prop — a button shown
 * or hidden conditionally just works.
 */
export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
  <div
    className={clsx(
      'flex flex-row items-center justify-end gap-3',
      'has-[>:nth-child(3)]:flex-col has-[>:nth-child(3)]:items-stretch has-[>:nth-child(3)]:[&>*]:w-full',
      'sm:flex-row! sm:items-center! sm:justify-end! sm:[&>*]:w-auto!',
      className
    )}
  >
    {children}
  </div>
)
