import type { LangBadgeProps } from './LangBadge.types'

/** Etiqueta compacta con el código de idioma (ej. "ES"), usada junto a
 * labels de campos traducibles y dentro de `LangSidebar`. */
export const LangBadge = ({ lang }: LangBadgeProps) => (
  <span className="bg-primary-700/10 text-primary-600 inline-flex h-5 items-center rounded px-1.5 text-[10px] font-semibold tracking-widest uppercase">
    {lang}
  </span>
)
