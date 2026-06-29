import clsx from 'clsx'
import type { SkeletonProps } from './Skeleton.types'

const variantClass: Record<NonNullable<SkeletonProps['variant']>, string> = {
  circle: 'rounded-full',
  rect: 'rounded-md',
  text: 'rounded',
}

export const Skeleton = ({ className, variant = 'text' }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={clsx(
      'animate-pulse bg-slate-200 dark:bg-slate-700',
      variantClass[variant],
      className
    )}
  />
)
