import clsx from 'clsx'
import { useId, useMemo } from 'react'

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'white' | 'gradient'
}

export const Spinner = ({ size = 'medium', variant = 'default' }: SpinnerProps) => {
  const COLOR_SPINNER = useMemo(
    () => ({
      default: {
        colorFrom: '#62748e',
        colorTo: '#62748e',
      },
      white: {
        colorFrom: '#f9f3f4',
        colorTo: '#f9f3f4',
      },
      gradient: {
        colorFrom: '#17CADD',
        colorTo: '#332eb9ff',
      },
    }),
    [],
  )
  const id_spinner = useId()
  return (
    <div
      className={clsx(
        'relative flex items-center justify-center',
        'transition-all ease-in-out duration-300 animate-spin',
        {
          'w-5 h-5': size === 'small',
          'w-10 h-10': size === 'medium',
          'w-16 h-16': size === 'large',
        },
      )}
      data-testid="spinner"
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="white" fillOpacity="0.01" />
        <path
          d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM3.2 16C3.2 23.0692 8.93075 28.8 16 28.8C23.0692 28.8 28.8 23.0692 28.8 16C28.8 8.93075 23.0692 3.2 16 3.2C8.93075 3.2 3.2 8.93075 3.2 16Z"
          className={clsx({
            'fill-slate-200': variant === 'default' || variant === 'gradient',
            'fill-slate-50/10': variant === 'white',
          })}
        />
        <path
          d="M30.4 16C31.2837 16 32.0083 16.7181 31.9201 17.5973C31.7642 19.1505 31.3816 20.6755 30.7821 22.1229C29.978 24.0641 28.7994 25.828 27.3137 27.3137C25.828 28.7994 24.0641 29.978 22.1229 30.7821C20.6755 31.3816 19.1505 31.7642 17.5973 31.9201C16.7181 32.0083 16 31.2837 16 30.4C16 29.5163 16.7191 28.8103 17.5958 28.7001C18.7284 28.5578 19.8393 28.2643 20.8983 27.8257C22.4513 27.1824 23.8624 26.2396 25.051 25.051C26.2396 23.8624 27.1824 22.4513 27.8257 20.8983C28.2643 19.8393 28.5578 18.7284 28.7001 17.5958C28.8103 16.7191 29.5163 16 30.4 16Z"
          fill={`url(#spinner_${id_spinner}${variant})`}
        />
        <defs>
          <linearGradient
            id={`spinner_${id_spinner}${variant}`}
            x1="0.0412215"
            y1="31.8951"
            x2="37.8632"
            y2="10.2611"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={COLOR_SPINNER[variant].colorFrom} />
            <stop offset="1" stopColor={COLOR_SPINNER[variant].colorTo} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
