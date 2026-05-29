import { useMemo } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import type { MonthCaptionProps, DateRange, Matcher } from 'react-day-picker'
import type { Locale } from 'date-fns'
import clsx from 'clsx'
import { IconComponent } from '../../../atoms/IconComponent/IconComponent'

export const DAY_PICKER_CLASS_NAMES = {
  root: 'p-1',
  months: 'flex gap-6',
  month: 'flex flex-col gap-2',
  month_caption: 'flex h-9 items-center justify-between gap-1 px-1',
  caption_label: 'text-sm font-semibold text-slate-900',
  nav: '',
  button_previous: '',
  button_next: '',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'w-9 py-1 text-center text-xs font-medium text-slate-400 capitalize',
  week: 'mt-1 flex',
  day: 'relative flex-1 p-0 text-center',
  day_button: [
    'mx-auto flex size-9 items-center justify-center rounded-sm text-sm',
    'text-slate-900 transition-colors duration-fast ease-out-expo',
    'hover:bg-slate-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
    'aria-selected:bg-primary-500 aria-selected:text-white aria-selected:hover:bg-primary-600',
    'aria-disabled:pointer-events-none aria-disabled:opacity-40',
  ].join(' '),
  selected: '',
  today: '[&>button]:font-bold [&>button]:ring-1 [&>button]:ring-primary-400 [&>button]:ring-offset-0',
  outside: 'opacity-40',
  disabled: '',
  range_start: [
    'bg-gradient-to-r from-transparent to-primary-100/60',
    '[&>button]:aria-selected:bg-primary-500 [&>button]:aria-selected:text-white',
    '[&>button]:aria-selected:hover:bg-primary-600',
  ].join(' '),
  range_end: [
    'bg-gradient-to-l from-transparent to-primary-100/60',
    '[&>button]:aria-selected:bg-primary-500 [&>button]:aria-selected:text-white',
    '[&>button]:aria-selected:hover:bg-primary-600',
  ].join(' '),
  range_middle: [
    'bg-primary-100/60',
    '[&>button]:rounded-none',
    '[&>button]:aria-selected:bg-transparent',
    '[&>button]:aria-selected:text-slate-900',
    '[&>button]:hover:bg-primary-200/60',
  ].join(' '),
  hidden: 'invisible',
}

export const CAPTION_BTN_CLS = clsx(
  'rounded-sm px-1.5 py-0.5 text-sm font-semibold text-slate-900',
  'transition-all duration-fast ease-out-expo',
  'hover:bg-slate-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
)

export const NAV_BTN_CLS = clsx(
  'flex size-7 shrink-0 items-center justify-center rounded-sm',
  'text-slate-500 transition-colors duration-fast ease-out-expo',
  'hover:bg-slate-100 hover:text-slate-900',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  'disabled:pointer-events-none disabled:opacity-30'
)

interface CalendarSingleProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  displayMonth?: Date
  onMonthChange?: (month: Date) => void
  disabled?: Matcher | Matcher[]
  locale?: Locale
  onMonthLabelClick?: () => void
  onYearLabelClick?: (year: number) => void
}

export const CalendarSingle = ({
  selected,
  onSelect,
  displayMonth,
  onMonthChange,
  disabled,
  locale,
  onMonthLabelClick,
  onYearLabelClick,
}: CalendarSingleProps) => {
  const components = useMemo(
    () => ({
      Nav: () => <></>,
      MonthCaption: ({ calendarMonth }: MonthCaptionProps) => {
        const raw = format(calendarMonth.date, 'MMMM', { locale })
        const monthLabel = raw.charAt(0).toUpperCase() + raw.slice(1)
        const yearLabel = format(calendarMonth.date, 'yyyy')
        const year = calendarMonth.date.getFullYear()
        const prev = subMonths(calendarMonth.date, 1)
        const next = addMonths(calendarMonth.date, 1)

        return (
          <div className="flex h-9 items-center justify-between gap-1 px-1">
            <button
              type="button"
              onClick={() => onMonthChange?.(prev)}
              className={NAV_BTN_CLS}
            >
              <IconComponent icon="RiArrowLeftSLine" className="size-4" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
              {onMonthLabelClick ? (
                <button type="button" onClick={onMonthLabelClick} className={CAPTION_BTN_CLS}>
                  {monthLabel}
                </button>
              ) : (
                <span className="px-1.5 py-0.5 text-sm font-semibold text-slate-900">
                  {monthLabel}
                </span>
              )}
              {onYearLabelClick ? (
                <button type="button" onClick={() => onYearLabelClick(year)} className={CAPTION_BTN_CLS}>
                  {yearLabel}
                </button>
              ) : (
                <span className="px-1.5 py-0.5 text-sm font-semibold text-slate-900">
                  {yearLabel}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onMonthChange?.(next)}
              className={NAV_BTN_CLS}
            >
              <IconComponent icon="RiArrowRightSLine" className="size-4" />
            </button>
          </div>
        )
      },
    }),
    [locale, onMonthLabelClick, onYearLabelClick, onMonthChange]
  )

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      month={displayMonth}
      onMonthChange={onMonthChange}
      disabled={disabled}
      locale={locale}
      showOutsideDays
      classNames={DAY_PICKER_CLASS_NAMES}
      components={components}
    />
  )
}

export type { DateRange }
