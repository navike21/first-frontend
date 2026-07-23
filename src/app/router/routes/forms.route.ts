import {
  createRoute,
  lazyRouteComponent,
  Outlet,
  type AnyRoute,
} from '@tanstack/react-router'
import { privateLayout } from '../layouts'
import { SUPPORTED_LANGUAGES } from '@/shared/types/languages'
import { ROUTE_SLUGS } from '@/shared/router/route-slugs'
import { requirePermission } from '@/shared/router'
import { CAN } from '@/shared/lib/permissions'
import type { Language } from '@/shared/types/languages'

const FormsPage = lazyRouteComponent(
  () => import('@domains/forms/pages/FormsPage'),
  'FormsPage'
)
const CreateFormPage = lazyRouteComponent(
  () => import('@domains/forms/pages/CreateFormPage'),
  'CreateFormPage'
)
const EditFormPage = lazyRouteComponent(
  () => import('@domains/forms/pages/EditFormPage'),
  'EditFormPage'
)
const FormsTrashPage = lazyRouteComponent(
  () => import('@domains/forms/pages/FormsTrashPage'),
  'FormsTrashPage'
)
const FormSubmissionsPage = lazyRouteComponent(
  () => import('@domains/forms/pages/FormSubmissionsPage'),
  'FormSubmissionsPage'
)

const parentSlugs = Array.from(
  new Set(SUPPORTED_LANGUAGES.map((l) => ROUTE_SLUGS.forms[l]))
)

export const allFormsRouteTrees = parentSlugs.map((parentSlug) => {
  const langs = SUPPORTED_LANGUAGES.filter(
    (l: Language) => ROUTE_SLUGS.forms[l] === parentSlug
  )

  const layout = createRoute({
    getParentRoute: () => privateLayout,
    path: parentSlug,
    component: Outlet,
    // Union of both resources' read permissions: a submissions-only role
    // (forms-submissions:read, no forms:read) must still get past this outer
    // gate to reach the submissions child route below, which re-checks the
    // more specific permission itself.
    beforeLoad: requirePermission(...CAN.formsView, ...CAN.formSubmissionsView),
  })

  const index = createRoute({
    getParentRoute: () => layout,
    path: '/',
    component: FormsPage,
    // The layout gate above is intentionally broader (see comment there) —
    // the list itself still requires forms:read specifically.
    beforeLoad: requirePermission(...CAN.formsView),
  })

  const children: AnyRoute[] = [index]
  const seen = new Set<string>()

  for (const lang of langs) {
    const createSlug = ROUTE_SLUGS.formCreate[lang]
    if (!seen.has(`c:${createSlug}`)) {
      seen.add(`c:${createSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: createSlug,
          component: CreateFormPage,
          beforeLoad: requirePermission(...CAN.formsCreate),
        })
      )
    }
    const editSlug = ROUTE_SLUGS.formEdit[lang]
    if (!seen.has(`e:${editSlug}`)) {
      seen.add(`e:${editSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${editSlug}/$formId`,
          component: EditFormPage,
          beforeLoad: requirePermission(...CAN.formsUpdate),
        })
      )
    }
    const trashSlug = ROUTE_SLUGS.formTrash[lang]
    if (!seen.has(`t:${trashSlug}`)) {
      seen.add(`t:${trashSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: trashSlug,
          component: FormsTrashPage,
          beforeLoad: requirePermission(...CAN.formsTrash),
        })
      )
    }
    const submissionsSlug = ROUTE_SLUGS.formSubmissions[lang]
    if (!seen.has(`s:${submissionsSlug}`)) {
      seen.add(`s:${submissionsSlug}`)
      children.push(
        createRoute({
          getParentRoute: () => layout,
          path: `${submissionsSlug}/$formId`,
          component: FormSubmissionsPage,
          // Separate permission from the form's own CRUD — a support/sales
          // role can triage submissions without editing the form.
          beforeLoad: requirePermission(...CAN.formSubmissionsView),
        })
      )
    }
  }

  return layout.addChildren(children)
})
