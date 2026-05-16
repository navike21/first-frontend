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
    'flex items-center w-full rounded-sm',
    'transition-all ease-in-out duration-300',
    'ring-inset',
    isOpen ? 'ring-2' : 'ring-1',
    { 'bg-slate-400/50': disabled, 'bg-white': !disabled },
    {
      'ring-slate-300': variant === 'default' && !disabled,
      'ring-emerald-500': variant === 'success' && !disabled,
      'ring-red-500': variant === 'error' && !disabled,
      'ring-yellow-500': variant === 'warning' && !disabled,
    },
    isMultipleWithChips ? 'h-auto min-h-10' : 'h-10',
    classInput,
  )
