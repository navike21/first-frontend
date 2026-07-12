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

// A moving highlight band reads as "loading" in both themes — a plain
// opacity pulse barely shows up against the dark-mode muted background.
const Shimmer = () => (
  <motion.div
    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/20"
    initial={{ x: '-100%' }}
    animate={{ x: '400%' }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
  />
)

interface SkeletonBlockProps {
  className?: string
  style?: CSSProperties
}

const SkeletonBlock = ({ className, style }: SkeletonBlockProps) => (
  <div aria-hidden="true" className={clsx('relative overflow-hidden bg-border-subtle', className)} style={style}>
    <Shimmer />
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

  return <SkeletonBlock className={clsx(variantClass[variant], className)} style={sizeStyle} />
}
