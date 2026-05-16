import { NAV } from './navigation.config'

export const SEGMENT_LABELS: Readonly<Record<string, string>> = {
  [NAV.clients.segment]: NAV.clients.shortLabel,
  [NAV.settings.segment]: NAV.settings.label,
  ...Object.fromEntries(Object.values(NAV.settings.children).map((m) => [m.segment, m.shortLabel])),
  crear: 'Crear',
  editar: 'Editar',
}
