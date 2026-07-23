'use client'

import clsx from 'clsx'
import { memo } from 'react'
import type { AvatarProps } from './Avatar.types'
import { useAvatar } from './Avatar.hooks'

export const Avatar = memo(
  ({
    src,
    alt = 'User avatar',
    size = 'md',
    status = 'none',
    className,
    title,
    ...props
  }: Readonly<AvatarProps>) => {
    const {
      sizeMap,
      statusColorMap,
      statusEffectMap,
      statusSizeMap,
      initials,
      ariaLabel,
    } = useAvatar({ ...props, alt })

    return (
      <figure
        className={clsx(
          'relative inline-flex aspect-square shrink-0 rounded-full',
          sizeMap[size],
          className
        )}
        aria-label={ariaLabel}
        title={title ?? ariaLabel}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className={clsx('h-full w-full object-cover', 'rounded-full')}
          />
        ) : (
          <span
            className={clsx(
              'flex h-full w-full items-center justify-center',
              'bg-primary-600 rounded-full font-bold text-white uppercase select-none'
            )}
          >
            {initials}
          </span>
        )}

        {status !== 'none' && (
          <span
            className={clsx(
              'absolute right-0 bottom-0',
              'ring-surface rounded-full ring-2',
              statusColorMap[status],
              statusEffectMap[status],
              statusSizeMap[size]
            )}
          />
        )}
      </figure>
    )
  }
)
