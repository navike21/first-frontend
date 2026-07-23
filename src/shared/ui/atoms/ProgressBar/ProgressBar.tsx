import clsx from 'clsx'

export interface ProgressBarProps {
  /** 0-100. */
  value: number
  className?: string
}

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={clsx(
        'bg-surface-subtle h-1 overflow-hidden rounded-full',
        className
      )}
    >
      <div
        className="bg-primary-600 h-full rounded-full transition-[width] duration-200 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
