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

// Pulso de carga: loop infinito, así que anima solo `scaleY` (transform,
// compositor) en vez de los atributos `y`/`height` del arranque — evita
// reflow de layout en cada frame mientras la carga se prolonga.
const PULSE_TRANSITION = { duration: 0.6, ease: 'easeInOut', repeat: Infinity } as const
const PULSE_STAGGER_S = 0.12

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
  pulse = false,
  ...props
}: AppLogoProps) => {
  const barClass = color === 'white' ? 'fill-white' : undefined
  const barClasses = [barClass ?? 'fill-primary-800', barClass ?? 'fill-primary-700', barClass ?? 'fill-primary-600']
  // Llamado siempre (regla de hooks); solo se usa si animateIn/pulse están activos.
  const reduceMotion = useReducedMotion()
  const shouldPulse = pulse && !reduceMotion
  const shouldAnimateIn = animateIn && !reduceMotion && !shouldPulse

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(sizeClass[size])}
      {...props}
    >
      <rect width="100" height="100" rx="22" className="fill-primary-950" />
      {BARS.map((bar, i) => {
        const barGeometry = {
          x: bar.x,
          y: bar.y,
          width: 13,
          height: bar.height,
          rx: 6.5,
          className: barClasses[i],
        }

        if (shouldPulse) {
          return (
            <motion.rect
              key={bar.x}
              {...barGeometry}
              style={{ originY: 1 }}
              initial={false}
              animate={{ scaleY: [1, 0.15, 1] }}
              transition={{ ...PULSE_TRANSITION, delay: i * PULSE_STAGGER_S }}
            />
          )
        }

        if (shouldAnimateIn) {
          return (
            <motion.rect
              key={bar.x}
              {...barGeometry}
              initial={{ y: 100, height: 0 }}
              animate={{ y: bar.y, height: bar.height }}
              transition={{ ...BAR_TRANSITION, delay: i * BAR_STAGGER_S }}
            />
          )
        }

        return <rect key={bar.x} {...barGeometry} />
      })}
    </svg>
  )
}
