import type { ButtonBaseProps } from '@/shared/types/buttonProps'

export type ButtonVariant = NonNullable<ButtonBaseProps['variant']>
export type ButtonSize = NonNullable<ButtonBaseProps['size']>

export const variantColorClasses: Record<ButtonVariant, string> = {
  // Azul First #4C86FF (primary-600) = el acento único del Manual de Marca
  // para CTAs; hover a --color-primary-hover (#3E6FE0, distinto de 700 que
  // el manual reserva para hover de texto/enlaces).
  primary: 'bg-primary-600 text-white',
  // SECONDARY del Design System: blanco/neutro (no azul) — borde y texto
  // neutros, para acciones tipo "Cancelar"/"Vista previa". En dark el manual
  // lo muestra transparente (no relleno), verificado en la franja LIGHT/DARK
  // de la sección Botones ("Cancelar": background:transparent en oscuro).
  secondary:
    'text-foreground bg-surface dark:bg-transparent ring-1 ring-border-control ring-inset',
  // GHOST del Design System: transparente, texto Azul Medio (#3E63B5).
  ghost: 'text-primary-700 bg-transparent dark:text-primary-300',
  text: 'text-foreground bg-transparent',
  // DESTRUCTIVE del Design System: blanco/neutro con borde y texto danger,
  // no rojo sólido — para acciones irreversibles (purgar/eliminar).
  destructive: 'text-danger-600 bg-surface ring-1 ring-danger-200 ring-inset',
}

export const variantHoverClasses: Record<ButtonVariant, string> = {
  primary: 'hover:bg-primary-hover',
  secondary: 'hover:bg-surface-subtle',
  ghost: 'hover:bg-surface-subtle',
  text: '',
  destructive: 'hover:bg-danger-50',
}

/**
 * Shape (layout + rounded corners) for every non-`text` button. Shared by
 * Button and LinkButton so all variants stay symmetric.
 */
export const buttonShapeClass =
  'flex items-center justify-center gap-2 rounded-control'

/** Padding + text size for non-`text` variants, by size — alturas fijas
 * (8/10/12 = 32/40/48px) y padding horizontal exactos del Design System. */
export const sizeClasses: Record<ButtonSize, string> = {
  small: 'h-8 px-3.5 text-[13px]',
  medium: 'h-10 px-[18px] text-sm',
  large: 'h-12 px-6 text-[15px]',
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
