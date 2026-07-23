import clsx from 'clsx'

export const DAY_PICKER_CLASS_NAMES = {
  root: 'p-1',
  months: 'flex gap-6',
  month: 'flex flex-col gap-2',
  month_caption: 'flex h-9 items-center justify-between gap-1 px-1',
  caption_label: 'text-sm font-semibold text-foreground',
  nav: '',
  button_previous: '',
  button_next: '',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'w-9 py-1 text-center text-xs font-medium text-muted capitalize',
  week: 'mt-1 flex',
  day: 'relative flex-1 p-0 text-center',
  day_button: [
    'mx-auto flex size-9 cursor-pointer items-center justify-center rounded-sm text-sm',
    'text-foreground transition-colors duration-fast ease-out-expo',
    'hover:bg-surface-subtle',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    'aria-selected:bg-primary-500 aria-selected:text-white aria-selected:hover:bg-primary-600',
    'aria-disabled:pointer-events-none aria-disabled:opacity-40',
  ].join(' '),
  selected: '',
  today:
    '[&>button]:font-bold [&>button]:ring-1 [&>button]:ring-primary-400 [&>button]:ring-offset-0',
  outside: 'opacity-40',
  disabled: '',
  range_start: [
    'bg-gradient-to-r from-transparent to-primary-100/60 dark:to-primary-900/40',
    '[&>button]:aria-selected:bg-primary-500 [&>button]:aria-selected:text-white',
    '[&>button]:aria-selected:hover:bg-primary-600',
  ].join(' '),
  range_end: [
    'bg-gradient-to-l from-transparent to-primary-100/60 dark:to-primary-900/40',
    '[&>button]:aria-selected:bg-primary-500 [&>button]:aria-selected:text-white',
    '[&>button]:aria-selected:hover:bg-primary-600',
  ].join(' '),
  range_middle: [
    'bg-primary-100/60 dark:bg-primary-900/40',
    '[&>button]:rounded-none',
    '[&>button]:aria-selected:bg-transparent',
    '[&>button]:aria-selected:text-foreground',
    '[&>button]:hover:bg-primary-200/60 dark:[&>button]:hover:bg-primary-800/40',
  ].join(' '),
  hidden: 'invisible',
}

export const CAPTION_BTN_CLS = clsx(
  'cursor-pointer rounded-sm px-1.5 py-0.5 text-sm font-semibold text-foreground',
  'transition-all duration-fast ease-out-expo',
  'hover:bg-surface-subtle',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
)

export const NAV_BTN_CLS = clsx(
  'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm',
  'text-secondary transition-colors duration-fast ease-out-expo',
  'hover:bg-surface-subtle hover:text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  'disabled:pointer-events-none disabled:opacity-30'
)
