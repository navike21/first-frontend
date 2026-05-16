import { NAV } from './navigation.config'

export const SEGMENT_LABELS: Readonly<Record<string, string>> = {
  [NAV.home.segment]: NAV.home.label,
  crear: 'Crear',
  editar: 'Editar',
}
