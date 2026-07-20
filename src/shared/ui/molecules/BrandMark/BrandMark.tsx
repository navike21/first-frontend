import clsx from 'clsx'
import { AppLogo } from '../../atoms/AppLogo/AppLogo'
import type { AppLogoSize } from '../../atoms/AppLogo/AppLogo.types'
import type { BrandMarkProps } from './BrandMark.types'

const gapClass: Record<AppLogoSize, string> = {
  'x-small': 'gap-2',
  small: 'gap-3',
  medium: 'gap-3',
  large: 'gap-3',
}

// Proporción texto/ícono ~0.77 (consistente en todos los mockups del Manual de
// Marca: login, sidebar, favicon, tamaño mínimo) — con `small` en text-2xl el
// wordmark se veía chico frente al ícono. `x-small` (Header) queda igual.
const textSizeClass: Record<AppLogoSize, string> = {
  'x-small': 'text-xl',
  small: 'text-3xl',
  medium: 'text-3xl',
  large: 'text-4xl',
}

/**
 * Lockup del Manual de Marca First: insignia + wordmark "First" — la
 * "versión principal" del manual (usar donde haya espacio). Para espacios
 * reducidos/avatares/favicon, usa `AppLogo` a secas (solo ícono).
 */
export const BrandMark = ({
  size = 'medium',
  color = 'default',
  animateIn = false,
  pulse = false,
  className,
}: BrandMarkProps) => (
  <span className={clsx('inline-flex items-center', gapClass[size], className)}>
    <AppLogo
      size={size}
      color={color}
      animateIn={animateIn}
      pulse={pulse}
      aria-hidden="true"
    />
    <span
      className={clsx(
        'font-display font-bold',
        color === 'white' ? 'text-white' : 'text-foreground',
        textSizeClass[size]
      )}
    >
      First
    </span>
  </span>
)
