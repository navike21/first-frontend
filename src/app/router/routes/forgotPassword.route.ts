import { createRoute } from '@tanstack/react-router'
import { publicLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { ForgotPasswordLayout } from '@domains/auth'
import type { Language } from '@/shared/types/languages'

function createForgotPasswordRoute(lang: Language) {
  return createRoute({
    getParentRoute: () => publicLayout,
    path: ROUTE_SLUGS.forgotPassword[lang],
    component: ForgotPasswordLayout,
  })
}

export const allForgotPasswordRouteTrees = SUPPORTED_LANGUAGES.map(
  createForgotPasswordRoute
)
