import clsx from 'clsx'
import { IconComponent } from '../../../atoms/IconComponent/IconComponent'

interface CalendarNavProps {
  onPrev: () => void
  onNext: () => void
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
  label: string
  onLabelClick?: () => void
}

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
        'transition-all duration-fast ease-out-expo',
        'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
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
          'transition-all duration-fast ease-out-expo',
          'hover:bg-(--surface-subtle)',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
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
        'transition-all duration-fast ease-out-expo',
        'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-30'
      )}
    >
      <IconComponent icon="RiArrowRightSLine" className="size-4" />
    </button>
  </div>
)
