import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { OptionProps } from './Option.types'

/** Single row of a custom listbox (`role="option"`); pass nodes into `leftSlot`/`rightSlot`. */
export const Option = ({
  value,
  label,
  leftSlot,
  rightSlot,
  disabled = false,
  selected,
  showCheck = false,
  onSelect,
  onFocus,
}: OptionProps) => (
  <button // NOSONAR — WAI-ARIA custom listbox: role=option required on interactive listbox children
    type="button"
    role="option"
    aria-selected={selected}
    aria-disabled={disabled || undefined}
    data-option
    disabled={disabled}
    onFocus={() => {
      if (!disabled) onFocus?.()
    }}
    onClick={() => {
      if (!disabled) onSelect(value)
    }}
    className={clsx(
      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
      'duration-fast ease-out-expo transition-colors',
      {
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-50': disabled,
        'bg-surface-subtle': selected && !disabled,
      },
      !disabled && 'hover:bg-surface-subtle'
    )}
  >
    {leftSlot && <span className="flex shrink-0 items-center">{leftSlot}</span>}
    <span className="flex-1">{label}</span>
    {rightSlot && (
      <span className="flex shrink-0 items-center">{rightSlot}</span>
    )}
    {showCheck && (
      <IconComponent
        icon="RiCheckLine"
        className="h-4 w-4 shrink-0 text-foreground"
      />
    )}
  </button>
)
