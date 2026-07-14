/** Color del punto de estado de un idioma en los indicadores de traducción
 * (LangSidebar/LangTabs): rojo si hay error de validación, verde si tiene
 * contenido, gris si está vacío. */
export function langDotClass(error: boolean, filled: boolean): string {
  if (error) return 'bg-red-500'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}
