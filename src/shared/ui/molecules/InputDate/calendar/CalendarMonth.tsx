import clsx from 'clsx'
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import type { Locale } from 'date-fns'
import { CalendarNav } from './CalendarNav'
import { isMonthDisabled, parseToDate } from '../InputDate.utils'

// Abbreviated + capitalized month names via date-fns (respects locale)
const getMonthLabels = (year: number, locale: Locale): string[] =>
  Array.from({ length: 12 }, (_, m) => {
    const iso = `${String(year).padStart(4, '0')}-${String(m + 1).padStart(2, '0')}-01`
    const label = format(parseISO(iso), 'MMM', { locale })
    return label.charAt(0).toUpperCase() + label.slice(1)
  })

interface CalendarMonthProps {
  selected?: Date
  onSelect: (year: number, month: number) => void
  minDate?: string
  maxDate?: string
  locale: Locale
  onYearLabelClick?: () => void
  /** Overrides the initial year shown — used in drill-down to preserve the year selected from the year grid */
  displayYear?: number
}

export const CalendarMonth = ({
  selected,
  onSelect,
  minDate,
  maxDate,
  locale,
  onYearLabelClick,
  displayYear,
}: CalendarMonthProps) => {
  const today = parseToDate(format(new Date(), 'yyyy-MM-dd'))
  const [viewYear, setViewYear] = useState(
    displayYear ??
      selected?.getFullYear() ??
      today?.getFullYear() ??
      new Date().getFullYear()
  )

  const monthLabels = getMonthLabels(viewYear, locale)
  const selectedYear = selected?.getFullYear()
  const selectedMonth = selected?.getMonth()
  const todayYear = today?.getFullYear()
  const todayMonth = today?.getMonth()

  const minYear = parseToDate(minDate)?.getFullYear()
  const maxYear = parseToDate(maxDate)?.getFullYear()

  return (
    <div className="p-3" style={{ minWidth: 260 }}>
      <CalendarNav
        label={String(viewYear)}
        onLabelClick={onYearLabelClick}
        onPrev={() => setViewYear((y) => y - 1)}
        onNext={() => setViewYear((y) => y + 1)}
        isPrevDisabled={minYear !== undefined && viewYear <= minYear}
        isNextDisabled={maxYear !== undefined && viewYear >= maxYear}
      />

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {monthLabels.map((label, m) => {
          const disabled = isMonthDisabled(viewYear, m, minDate, maxDate)
          const isSelected = selectedYear === viewYear && selectedMonth === m
          const isToday = todayYear === viewYear && todayMonth === m

          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(viewYear, m)}
              className={clsx(
                'flex h-9 items-center justify-center',
                'rounded-sm text-sm',
                'duration-fast ease-out-expo transition-all',
                'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none',
                {
                  'bg-primary-500 text-white': isSelected,
                  'text-(--text-primary)': !isSelected && !disabled,
                  'cursor-not-allowed text-slate-300 dark:text-slate-600':
                    disabled,
                  'ring-primary-400 font-bold ring-1': isToday && !isSelected,
                },
                {
                  'hover:bg-primary-600': isSelected,
                  'hover:bg-(--surface-subtle)': !isSelected && !disabled,
                }
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
