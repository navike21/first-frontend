import type { AvatarStatus } from '../../atoms/Avatar/Avatar.types'

export interface UserMenuLabels {
  ariaLabel: string
  profile: string
  preferences: string
  themeDark: string
  themeLight: string
  logout: string
}

export interface UserMenuProps {
  name: string
  email: string
  avatarSrc?: string
  avatarStatus?: AvatarStatus
  /** Destino de "Mi perfil" — el molecule no conoce el router del consumidor. */
  profileHref: string
  labels: UserMenuLabels
  onPreferencesClick: () => void
  onLogoutClick: () => void
}
