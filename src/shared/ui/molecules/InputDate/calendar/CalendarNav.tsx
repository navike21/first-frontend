import clsx from 'clsx'
import { IconComponent } from '../../../atoms/IconComponent/IconComponent'
import type { CalendarNavProps } from './CalendarNav.types'

export const CalendarNav = ({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
  label,
  onLabelClick,
}: CalendarNavProps) => (
  <div className="flex h-9 items-center justify-between gap-1">
    <button
      type="button"
      disabled={isPrevDisabled}
      onClick={onPrev}
      className={clsx(
        'flex size-7 shrink-0 items-center justify-center',
        'rounded-sm text-(--text-secondary)',
        'duration-fast ease-out-expo transition-all',
        'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
        'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-30'
      )}
    >
      <IconComponent icon="RiArrowLeftSLine" className="size-4" />
    </button>

    {onLabelClick ? (
      <button
        type="button"
        onClick={onLabelClick}
        className={clsx(
          'min-w-0 flex-1 px-2',
          'rounded-sm text-sm font-semibold text-(--text-primary)',
          'duration-fast ease-out-expo transition-all',
          'hover:bg-(--surface-subtle)',
          'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
        )}
      >
        {label}
      </button>
    ) : (
      <span className="min-w-0 flex-1 text-center text-sm font-semibold text-(--text-primary)">
        {label}
      </span>
    )}

    <button
      type="button"
      disabled={isNextDisabled}
      onClick={onNext}
      className={clsx(
        'flex size-7 shrink-0 items-center justify-center',
        'rounded-sm text-(--text-secondary)',
        'duration-fast ease-out-expo transition-all',
        'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
        'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-30'
      )}
    >
      <IconComponent icon="RiArrowRightSLine" className="size-4" />
    </button>
  </div>
)
