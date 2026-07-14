import type { LangBadgeProps } from './LangBadge.types'

/** Etiqueta compacta con el código de idioma (ej. "ES"), usada junto a
 * labels de campos traducibles y dentro de `LangSidebar`. */
export const LangBadge = ({ lang }: LangBadgeProps) => (
  <span className="inline-flex h-5 items-center rounded bg-primary-700/10 px-1.5 text-[10px] font-semibold tracking-widest text-primary-600 uppercase">
    {lang}
  </span>
)
