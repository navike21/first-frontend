import clsx from 'clsx'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  padding?: 'none' | 'small' | 'medium' | 'large'
  interactive?: boolean
}

export const Card = ({
  children,
  className,
  padding = 'medium',
  interactive = false,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-(--border) bg-(--surface) shadow-sm',
        'duration-fast ease-out-expo transition-all',
        {
          'p-0': padding === 'none',
          'p-4': padding === 'small',
          'p-6': padding === 'medium',
          'p-8': padding === 'large',
        },
        {
          'hover:border-gray-300 hover:shadow-md dark:hover:border-slate-500':
            interactive,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
