import clsx from 'clsx'
import { motion, useReducedMotion } from 'motion/react'
import type { AppLogoProps, AppLogoSize } from './AppLogo.types'

const sizeClass: Record<AppLogoSize, string> = {
  'x-small': 'w-8',
  small: 'w-10',
  medium: 'w-14',
  large: 'w-18',
}

// Rebote sutil (mismo cubic-bezier que --ease-spring-bounce en index.css) —
// coherente con el resto de "pop"s de la app (ej. animate-modal-spring-pop).
const BAR_TRANSITION = { duration: 0.32, ease: [0.34, 1.56, 0.64, 1.08] } as const
const BAR_STAGGER_S = 0.09

interface Bar {
  x: number
  y: number
  height: number
}

// Geometría exacta del asset oficial (first-icon.svg) — badge 100×100 rx=22,
// 3 barras ascendentes de izquierda a derecha (la última es la más alta,
// el acento Azul First).
const BARS: Bar[] = [
  { x: 27, y: 48, height: 24 },
  { x: 44, y: 36, height: 36 },
  { x: 61, y: 22, height: 50 },
]

/**
 * Insignia del Manual de Marca First: badge Navy Base + 3 barras ascendentes.
 * Geometría exacta del asset oficial exportado (first-icon.svg), no una
 * aproximación. `default` = a color completo (badge navy, barras en la rampa
 * primary — la más alta y brillante es el acento Azul First). `white` =
 * monocromo negativo (mismo badge navy, barras blancas) para variantes de un
 * solo tono. Fills siempre por clase (primary-950/800/700/600, o white) —
 * nunca un hex suelto; cambiar la paleta de marca = editar los tokens en
 * index.css.
 */
export const AppLogo = ({
  color = 'default',
  size = 'medium',
  animateIn = false,
  ...props
}: AppLogoProps) => {
  const barClass = color === 'white' ? 'fill-white' : undefined
  const barClasses = [barClass ?? 'fill-primary-800', barClass ?? 'fill-primary-700', barClass ?? 'fill-primary-600']
  // Llamado siempre (regla de hooks); solo se usa si animateIn está activo.
  const reduceMotion = useReducedMotion()
  const shouldAnimate = animateIn && !reduceMotion

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(sizeClass[size])}
      {...props}
    >
      <rect width="100" height="100" rx="22" className="fill-primary-950" />
      {BARS.map((bar, i) =>
        shouldAnimate ? (
          <motion.rect
            key={bar.x}
            x={bar.x}
            width="13"
            rx="6.5"
            className={barClasses[i]}
            initial={{ y: 100, height: 0 }}
            animate={{ y: bar.y, height: bar.height }}
            transition={{ ...BAR_TRANSITION, delay: i * BAR_STAGGER_S }}
          />
        ) : (
          <rect key={bar.x} x={bar.x} y={bar.y} width="13" height={bar.height} rx="6.5" className={barClasses[i]} />
        )
      )}
    </svg>
  )
}
