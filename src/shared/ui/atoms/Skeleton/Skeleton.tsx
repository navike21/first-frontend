import clsx from 'clsx'

export interface SkeletonProps {
  className?: string
  /**
   * circle  → rounded-full (avatar, icon placeholders)
   * rect    → rounded-md   (buttons, chips)
   * text    → rounded      (single line of text, ~75% width)
   */
  variant?: 'circle' | 'rect' | 'text'
}

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
