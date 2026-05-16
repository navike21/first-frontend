import type { IconName } from '@/shared/types/icons'
import type { SelectVariant } from '../Select.types'

export const VARIANT_ICON_MAP: Partial<
  Record<SelectVariant, { icon: IconName; className: string }>
> = {
  success: {
    icon: 'RiCheckboxCircleFill',
    className: 'text-emerald-500 mr-3 size-5',
  },
  error: {
    icon: 'RiErrorWarningFill',
    className: 'text-red-500 mr-3 size-5',
  },
  warning: {
    icon: 'RiErrorWarningFill',
    className: 'text-yellow-500 mr-3 size-5',
  },
}
