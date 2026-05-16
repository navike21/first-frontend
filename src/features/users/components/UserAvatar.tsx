import { RiUserLine } from '@remixicon/react'
import type { User as UserType } from '../model/types'

interface UserAvatarProps {
  user: Pick<UserType, 'firstName' | 'lastName' | 'profilePicture'>
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
}

const iconSizes = { sm: 14, md: 16, lg: 20 } as const

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const cls = `${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0`

  if (user.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
        className={`${cls} object-cover`}
      />
    )
  }

  if (user.firstName && user.lastName) {
    return (
      <span className={`${cls} bg-primary-950/10 text-primary-950 font-semibold`}>
        {initials(user.firstName, user.lastName)}
      </span>
    )
  }

  return (
    <span className={`${cls} bg-slate-100 text-slate-400`}>
      <RiUserLine size={iconSizes[size]} />
    </span>
  )
}
