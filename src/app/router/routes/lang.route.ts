import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from '../root'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { useLanguageStore } from '@/shared/model/language.store'
import type { Language } from '@/shared/types/languages'

export const langRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$lang',
  beforeLoad: ({ params }) => {
    const lang = (params as { lang: string }).lang
    if (!SUPPORTED_LANGUAGES.includes(lang as Language)) {
      throw redirect({ to: '/no-encontrada' as never })
    }
    useLanguageStore.getState().setLanguage(lang as Language)
  },
})
