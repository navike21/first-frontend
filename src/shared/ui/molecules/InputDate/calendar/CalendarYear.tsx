import clsx from 'clsx'
import { CalendarNav } from './CalendarNav'
import { isYearDisabled, getYearPage, todayDate } from '../InputDate.utils'

interface CalendarYearProps {
  selected?: Date
  yearPage: number[]
  onPageChange: (newCenter: number) => void
  onSelect: (year: number) => void
  minDate?: string
  maxDate?: string
}

export const CalendarYear = ({
  selected,
  yearPage,
  onPageChange,
  onSelect,
  minDate,
  maxDate,
}: CalendarYearProps) => {
  const selectedYear = selected?.getFullYear()
  const todayYear = todayDate().getFullYear()
  const firstYear = yearPage[0]
  const lastYear = yearPage[yearPage.length - 1]

  const prevPageCenter = getYearPage(firstYear - 1)[0]
  const nextPageCenter = getYearPage(lastYear + 1)[0]

  const isPrevDisabled =
    isYearDisabled(prevPageCenter, minDate, maxDate) &&
    isYearDisabled(firstYear - 1, minDate, maxDate)

  const isNextDisabled =
    isYearDisabled(nextPageCenter, minDate, maxDate) &&
    isYearDisabled(lastYear + 1, minDate, maxDate)

  return (
    <div className="p-3" style={{ minWidth: 260 }}>
      <CalendarNav
        label={`${firstYear} – ${lastYear}`}
        onPrev={() => onPageChange(firstYear - 1)}
        onNext={() => onPageChange(lastYear + 1)}
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
      />

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {yearPage.map((year) => {
          const disabled = isYearDisabled(year, minDate, maxDate)
          const isSelected = selectedYear === year
          const isToday = todayYear === year

          return (
            <button
              key={year}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(year)}
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
              {year}
            </button>
          )
        })}
      </div>
    </div>
  )
}
