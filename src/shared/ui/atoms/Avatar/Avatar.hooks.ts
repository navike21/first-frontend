import type { AvatarProps } from './Avatar.types'

const SIZE_MAP = {
  // Fixed width AND height (size-*) so the avatar is always a circle. `min-w-*`
  // let the figure stretch to a photo's intrinsic width → it rendered as an oval.
  sm: 'size-8 text-sm',
  md: 'size-12 text-base',
  lg: 'size-16 text-lg',
} as const

const STATUS_COLOR_MAP = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-400',
} as const

const STATUS_EFFECT_MAP = {
  online: 'avatar-online-ripple',
  busy: 'avatar-busy-pulse',
  away: 'avatar-away-pulse',
  offline: 'avatar-offline',
} as const

const STATUS_SIZE_MAP = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
} as const

export const useAvatar = ({ name, alt }: Pick<AvatarProps, 'name' | 'alt'>) => {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((word: string) => word[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : '?'

  const ariaLabel = name ?? alt

  return {
    initials,
    ariaLabel,
    sizeMap: SIZE_MAP,
    statusColorMap: STATUS_COLOR_MAP,
    statusEffectMap: STATUS_EFFECT_MAP,
    statusSizeMap: STATUS_SIZE_MAP,
  }
}
