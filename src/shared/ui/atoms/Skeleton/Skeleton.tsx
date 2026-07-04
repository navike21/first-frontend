import clsx from 'clsx'
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

  const rowClasses = 'animate-pulse bg-border-subtle rounded h-4'

  if (variant === 'text' && rows > 1) {
    return (
      <div aria-hidden="true" className={clsx('space-y-2', className)}>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className={clsx(rowClasses, i === rows - 1 && !width && 'w-3/4')}
            style={sizeStyle}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={clsx(
        'animate-pulse bg-border-subtle',
        variantClass[variant],
        className
      )}
      style={sizeStyle}
    />
  )
}
