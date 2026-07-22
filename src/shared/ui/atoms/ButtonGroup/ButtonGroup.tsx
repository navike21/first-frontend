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
 *
 * `Button`'s own base class is `w-full sm:w-fit` (full-width tap target on
 * mobile by default) — inside a `flex-wrap` row that alone made 2 buttons
 * each claim the whole line and wrap onto their own row instead of sharing
 * it (confirmed live: Button's `width:100%` becomes each item's flex-basis
 * in a row, so two 100%-wide items can never fit side by side no matter the
 * viewport). `[&>*]:flex-1` overrides that via `flex-basis`, which takes
 * priority over `width` for the flex algorithm's main-axis sizing — the two
 * buttons then split the row evenly. `has-[>:nth-child(3)]:[&>*]:flex-none`
 * hands sizing back to Button's own `w-full`/`sm:w-fit` for the stacked
 * case, where each button should size to its own row, not stretch/grow.
 */
export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
  <div
    className={clsx(
      'flex flex-row items-center justify-end gap-3 [&>*]:min-w-0 [&>*]:flex-1',
      'has-[>:nth-child(3)]:flex-col has-[>:nth-child(3)]:items-stretch has-[>:nth-child(3)]:[&>*]:flex-none',
      'sm:flex-row! sm:items-center! sm:justify-end! sm:[&>*]:flex-none!',
      className
    )}
  >
    {children}
  </div>
)
