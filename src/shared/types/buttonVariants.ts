import type { ButtonBaseProps } from '@/shared/types/buttonProps'

export type ButtonVariant = NonNullable<ButtonBaseProps['variant']>
export type ButtonSize = NonNullable<ButtonBaseProps['size']>

export const variantColorClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white',
  // Brand-colored outline (uses primary-* so it follows the active color
  // theme) over the surface — for "cancel" / dismiss actions.
  secondary:
    'text-primary-700 bg-(--surface) ring-1 ring-primary-700 ring-inset dark:text-primary-300 dark:ring-primary-300',
  // Same brand outline on a transparent background — tertiary / infrequent.
  outline:
    'text-primary-700 bg-transparent ring-1 ring-primary-700 ring-inset dark:text-primary-300 dark:ring-primary-300',
  text: 'text-(--text-primary) bg-transparent',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
  information: 'bg-blue-600 text-white',
}

export const variantHoverClasses: Record<ButtonVariant, string> = {
  primary: 'hover:bg-primary-800',
  secondary: 'hover:bg-primary-700/10',
  outline: 'hover:bg-primary-700/10',
  text: '',
  warning: 'hover:bg-amber-600',
  error: 'hover:bg-red-700',
  information: 'hover:bg-blue-700',
}

/**
 * Single source of truth for button elevation, shared by Button, LinkButton
 * and IconButton. Every real button carries a shadow; only the link-style
 * `text` variant stays flat.
 */
export const variantHasShadow: Record<ButtonVariant, boolean> = {
  primary: true,
  secondary: true,
  outline: true,
  text: false,
  warning: true,
  error: true,
  information: true,
}

/**
 * Shape (layout + rounded corners) for every non-`text` button. Shared by
 * Button and LinkButton so all variants stay symmetric.
 */
export const buttonShapeClass =
  'flex items-center justify-center gap-2 rounded-md'

/** Padding + text size for non-`text` variants, by size. */
export const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-6 py-3 text-xs',
  medium: 'px-8 py-3.5 text-sm',
  large: 'px-10 py-4 text-md',
}

/** Text size for the `text` variant (no padding box), by size. */
export const textSizeClasses: Record<ButtonSize, string> = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-md',
}

/** Leading/trailing icon dimensions, by size. */
export const iconSizeClasses: Record<ButtonSize, string> = {
  small: 'h-4 w-4',
  medium: 'h-5 w-5',
  large: 'h-6 w-6',
}
