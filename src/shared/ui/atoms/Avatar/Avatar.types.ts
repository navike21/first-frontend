export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  status?: AvatarStatus
  className?: string
  title?: string
}
