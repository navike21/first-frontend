import { useMemo } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import type { MonthCaptionProps, DateRange, Matcher } from 'react-day-picker'
import type { Locale } from 'date-fns'
import clsx from 'clsx'
import { IconComponent } from '../../../atoms/IconComponent/IconComponent'
import {
  DAY_PICKER_CLASS_NAMES,
  CAPTION_BTN_CLS,
  NAV_BTN_CLS,
} from './CalendarSingle.constants'

interface CalendarRangeProps {
  selected?: DateRange
  onSelect: (range: DateRange | undefined) => void
  displayMonth?: Date
  onMonthChange?: (month: Date) => void
  disabled?: Matcher | Matcher[]
  locale?: Locale
  onMonthLabelClick?: () => void
  onYearLabelClick?: (year: number) => void
}

export const CalendarRange = ({
  selected,
  onSelect,
  displayMonth,
  onMonthChange,
  disabled,
  locale,
  onMonthLabelClick,
  onYearLabelClick,
}: CalendarRangeProps) => {
  const components = useMemo(
    () => ({
      Nav: () => <></>,
      MonthCaption: ({ calendarMonth, displayIndex }: MonthCaptionProps) => {
        const raw = format(calendarMonth.date, 'MMMM', { locale })
        const monthLabel = raw.charAt(0).toUpperCase() + raw.slice(1)
        const yearLabel = format(calendarMonth.date, 'yyyy')
        const year = calendarMonth.date.getFullYear()
        // Compute the left month regardless of which caption we're in
        const leftMonth = subMonths(calendarMonth.date, displayIndex)
        const showPrev = displayIndex === 0
        const showNext = displayIndex === 1

        return (
          <div className="flex h-9 items-center justify-between gap-1 px-1">
            <button
              type="button"
              onClick={() => onMonthChange?.(subMonths(leftMonth, 1))}
              className={clsx(NAV_BTN_CLS, !showPrev && 'invisible')}
              tabIndex={showPrev ? 0 : -1}
            >
              <IconComponent icon="RiArrowLeftSLine" className="size-4" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
              {onMonthLabelClick ? (
                <button
                  type="button"
                  onClick={onMonthLabelClick}
                  className={CAPTION_BTN_CLS}
                >
                  {monthLabel}
                </button>
              ) : (
                <span className="px-1.5 py-0.5 text-sm font-semibold text-(--text-primary)">
                  {monthLabel}
                </span>
              )}
              {onYearLabelClick ? (
                <button
                  type="button"
                  onClick={() => onYearLabelClick(year)}
                  className={CAPTION_BTN_CLS}
                >
                  {yearLabel}
                </button>
              ) : (
                <span className="px-1.5 py-0.5 text-sm font-semibold text-(--text-primary)">
                  {yearLabel}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onMonthChange?.(addMonths(leftMonth, 1))}
              className={clsx(NAV_BTN_CLS, !showNext && 'invisible')}
              tabIndex={showNext ? 0 : -1}
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
      mode="range"
      selected={selected}
      onSelect={onSelect}
      month={displayMonth}
      onMonthChange={onMonthChange}
      disabled={disabled}
      locale={locale}
      numberOfMonths={2}
      showOutsideDays
      classNames={DAY_PICKER_CLASS_NAMES}
      components={components}
    />
  )
}
