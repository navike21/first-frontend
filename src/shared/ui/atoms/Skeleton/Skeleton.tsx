import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import type { SkeletonProps } from './Skeleton.types'

const variantClass: Record<NonNullable<SkeletonProps['variant']>, string> = {
  circle: 'rounded-full',
  rect: 'rounded-md',
  text: 'rounded h-4',
}

function toCss(val: string | number | undefined): string | undefined {
  if (val === undefined) return undefined
  return typeof val === 'number' ? `${val}px` : val
}

// The whole block breathes between the base tone and a neutral tint — in
// dark mode that tint lightens it (a soft glow), in light mode it darkens
// it slightly. A plain opacity pulse on the base color alone barely showed
// up against the dark-mode background, since the color itself never changed.
const Pulse = () => (
  <motion.div
    className="absolute inset-0 bg-slate-400 dark:bg-slate-300"
    animate={{ opacity: [0.12, 0.35, 0.12] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
  />
)

interface SkeletonBlockProps {
  className?: string
  style?: CSSProperties
}

const SkeletonBlock = ({ className, style }: SkeletonBlockProps) => (
  <div
    aria-hidden="true"
    className={clsx('bg-border-subtle relative overflow-hidden', className)}
    style={style}
  >
    <Pulse />
  </div>
)

export const Skeleton = ({
  className,
  variant = 'text',
  width,
  height,
  rows = 1,
}: SkeletonProps) => {
  const w = toCss(width)
  const h = toCss(height)
  const sizeStyle = w || h ? { width: w, height: h } : undefined

  if (variant === 'text' && rows > 1) {
    return (
      <div aria-hidden="true" className={clsx('space-y-2', className)}>
        {Array.from({ length: rows }, (_, i) => (
          <SkeletonBlock
            key={i}
            className={clsx('h-4 rounded', i === rows - 1 && !width && 'w-3/4')}
            style={sizeStyle}
          />
        ))}
      </div>
    )
  }

  return (
    <SkeletonBlock
      className={clsx(variantClass[variant], className)}
      style={sizeStyle}
    />
  )
}
