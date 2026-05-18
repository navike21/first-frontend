import type { Language } from '@/shared/types/languages'

export const ROUTE_SLUGS = {
  forbidden: {
    es: 'no-autorizado',
    en: 'unauthorized',
    de: 'nicht-autorisiert',
    fr: 'acces-interdit',
    pt: 'nao-autorizado',
    it: 'non-autorizzato',
    ja: 'mi-ninka',
    ko: 'mi-seungni',
    zh: 'wei-shouquan',
    ru: 'ne-avtorizovan',
  },
  notFound: {
    es: 'no-encontrada',
    en: 'not-found',
    de: 'nicht-gefunden',
    fr: 'introuvable',
    pt: 'nao-encontrada',
    it: 'non-trovata',
    ja: 'mitsuke-nai',
    ko: 'mot-chateum',
    zh: 'wei-zhaodao',
    ru: 'ne-naydeno',
  },
  users: {
    es: 'usuarios',
    en: 'users',
    de: 'benutzer',
    fr: 'utilisateurs',
    pt: 'utilizadores',
    it: 'utenti',
    ja: 'yuzaa',
    ko: 'sayongja',
    zh: 'yonghu',
    ru: 'polzovateli',
  },
  userCreate: {
    es: 'nuevo',
    en: 'new',
    de: 'neu',
    fr: 'nouveau',
    pt: 'novo',
    it: 'nuovo',
    ja: 'atarashii',
    ko: 'sae',
    zh: 'xin',
    ru: 'novyy',
  },
  userEdit: {
    es: 'editar',
    en: 'edit',
    de: 'bearbeiten',
    fr: 'modifier',
    pt: 'alterar',
    it: 'modifica',
    ja: 'henshu',
    ko: 'pyeonjip',
    zh: 'bianji',
    ru: 'redakt',
  },
} as const satisfies Record<string, Record<Language, string>>

export type RouteModule = keyof typeof ROUTE_SLUGS

// Reverse lookup: any slug (across all languages) → module key
export const SLUG_TO_MODULE: Readonly<Record<string, RouteModule>> = Object.fromEntries(
  (Object.entries(ROUTE_SLUGS) as [RouteModule, Record<Language, string>][]).flatMap(
    ([module, langs]) => Object.values(langs).map((slug) => [slug, module]),
  ),
)

export function translatePath(path: string, newLang: Language): string {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return `/${newLang}`

  // segments[0] is the current lang — replace it
  const rest = segments.slice(1)

  const translatedRest = rest.map((segment) => {
    const module = SLUG_TO_MODULE[segment]
    if (module) return ROUTE_SLUGS[module][newLang]
    return segment // IDs and unknown segments pass through unchanged
  })

  return `/${newLang}${translatedRest.length ? `/${translatedRest.join('/')}` : ''}`
}
