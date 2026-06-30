import { useMemo } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import type { MonthCaptionProps, DateRange } from 'react-day-picker'
import { IconComponent } from '../../../atoms/IconComponent/IconComponent'
import {
  DAY_PICKER_CLASS_NAMES,
  CAPTION_BTN_CLS,
  NAV_BTN_CLS,
} from './CalendarSingle.constants'
import type { CalendarSingleProps } from './CalendarSingle.types'

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
                <button
                  type="button"
                  onClick={onMonthLabelClick}
                  className={CAPTION_BTN_CLS}
                >
                  {monthLabel}
                </button>
              ) : (
                <span className="px-1.5 py-0.5 text-sm font-semibold text-foreground">
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
                <span className="px-1.5 py-0.5 text-sm font-semibold text-foreground">
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
