import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from '../root'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { useLanguageStore } from '@/shared/model/language.store'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import type { Language } from '@/shared/types/languages'

const DEFAULT_LANG: Language = 'es'

export const langRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$lang',
  beforeLoad: ({ params }) => {
    const lang = (params as { lang: string }).lang
    if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
      throw redirect({
        to: `/${DEFAULT_LANG}/${ROUTE_SLUGS.notFound[DEFAULT_LANG]}` as never,
      })
    }
    useLanguageStore.getState().setLanguage(lang as Language)
  },
})

export const langCatchAll = createRoute({
  getParentRoute: () => langRoute,
  path: '*',
  beforeLoad: () => {
    const lang = useLanguageStore.getState().language
    throw redirect({
      to: `/${lang}/${ROUTE_SLUGS.notFound[lang]}` as never,
      replace: true,
    })
  },
  component: () => null,
})
