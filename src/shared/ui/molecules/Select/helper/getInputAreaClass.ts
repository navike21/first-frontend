import clsx from 'clsx'
import type { SelectVariant } from '../Select.types'

// Pure helper — keeps input-area className computation out of the forwardRef scope
export const getInputAreaClass = ({
  disabled,
  isOpen,
  variant,
  isMultipleWithChips,
  classInput,
}: {
  disabled: boolean
  isOpen: boolean
  variant: SelectVariant
  isMultipleWithChips: boolean
  classInput?: string
}): string =>
  clsx(
    'flex items-center w-full rounded-select',
    'transition-all ease-in-out duration-300',
    {
      'bg-surface-subtle': disabled,
      'bg-surface-input ring-inset': !disabled,
    },
    // No ring at all when disabled — matches InputLayout, which only ever
    // applies ring-1/ring-inset in the !disabled branch. Applying a bare
    // ring-1/ring-2 with no color class here used to fall back to
    // Tailwind's default ring color (a stray blue), the actual mismatch vs.
    // the input's clean, borderless disabled look.
    !disabled && (isOpen ? 'ring-2' : 'ring-1'),
    {
      'ring-border-control hover:ring-border-hover':
        variant === 'default' && !disabled,
      'ring-emerald-500': variant === 'success' && !disabled,
      'ring-danger-600': variant === 'error' && !disabled,
      'ring-yellow-500': variant === 'warning' && !disabled,
    },
    isMultipleWithChips ? 'h-auto min-h-10' : 'h-10',
    classInput
  )
