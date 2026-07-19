import clsx from 'clsx'
import type { AppLogoProps, AppLogoSize } from './AppLogo.types'

const sizeClass: Record<AppLogoSize, string> = {
  'x-small': 'w-8',
  small: 'w-10',
  medium: 'w-14',
  large: 'w-18',
}

/**
 * Insignia del Manual de Marca First: badge Navy Base + 3 barras ascendentes.
 * `default` = a color completo (badge navy, barras en la rampa primary —
 * la más alta y brillante es el acento Azul First). `white` = monocromo
 * negativo (mismo badge navy, barras blancas) para variantes de un solo tono.
 * Fills siempre por clase (primary-950/800/700/600, o white) — nunca un hex
 * suelto; cambiar la paleta de marca = editar los tokens en index.css.
 */
export const AppLogo = ({
  color = 'default',
  size = 'medium',
  ...props
}: AppLogoProps) => {
  const barClass = color === 'white' ? 'fill-white' : undefined

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(sizeClass[size])}
      {...props}
    >
      <rect width="64" height="64" rx="14" className="fill-primary-950" />
      <rect x="13" y="34" width="9" height="16" rx="3" className={barClass ?? 'fill-primary-800'} />
      <rect x="27.5" y="25" width="9" height="25" rx="3" className={barClass ?? 'fill-primary-700'} />
      <rect x="42" y="16" width="9" height="34" rx="3" className={barClass ?? 'fill-primary-600'} />
    </svg>
  )
}
