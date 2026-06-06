import type { ButtonBaseProps } from '@/shared/types/buttonProps'

export type ButtonVariant = NonNullable<ButtonBaseProps['variant']>

export const variantColorClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-950 text-white',
  secondary: 'text-(--text-primary) bg-(--surface) ring-1 ring-black dark:ring-slate-600 ring-inset',
  text: 'text-(--text-primary) bg-transparent',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
  information: 'bg-blue-600 text-white',
}

export const variantHoverClasses: Record<ButtonVariant, string> = {
  primary: 'hover:bg-gray-800',
  secondary: 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:ring-2',
  text: '',
  warning: 'hover:bg-amber-600',
  error: 'hover:bg-red-700',
  information: 'hover:bg-blue-700',
}
