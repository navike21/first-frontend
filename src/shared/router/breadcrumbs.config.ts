import { NAV } from './navigation.config'

export const SEGMENT_LABELS: Readonly<Record<string, string>> = {
  [NAV.home.segment]: NAV.home.label,
  [NAV.users.segment]: NAV.users.label,
  [NAV.userCreate.segment]: NAV.userCreate.label,
  crear: 'Crear',
  editar: 'Editar',
}
