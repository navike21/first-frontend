import { useSessionStore } from '@/shared/model'

/**
 * True if `permissions` satisfies ANY of `required`. The `*:*` super-root
 * wildcard grants everything. Callers that want "manage implies CRUD" semantics
 * must include the `:manage` permission in `required` explicitly (see {@link CAN}).
 */
export function hasPermission(
  permissions: string[],
  ...required: string[]
): boolean {
  if (permissions.includes('*:*')) return true
  return required.some((p) => permissions.includes(p))
}

const EMPTY_PERMISSIONS: string[] = []

/** Reactive permission check for components. */
export function useHasPermission(...required: string[]): boolean {
  const permissions = useSessionStore(
    (s) => s.user?.permissions ?? EMPTY_PERMISSIONS
  )
  return hasPermission(permissions, ...required)
}

/**
 * Reads the current user's permissions outside React — for route guards
 * (`beforeLoad`) that run before any component mounts.
 */
export function getSessionPermissions(): string[] {
  return useSessionStore.getState().user?.permissions ?? EMPTY_PERMISSIONS
}

/**
 * Capability → required permissions (any-of). `:manage` is included where the
 * backend treats it as granting that action (CRUD but NOT purge — purge needs
 * explicit `:purge` or `*:*`). `*:*` is always honored by {@link hasPermission}.
 * Single source of truth shared by the sidebar menu, route guards and in-page
 * action gating.
 */
export const CAN = {
  usersView: ['users:read', 'users:manage'],
  usersCreate: ['users:create', 'users:manage'],
  usersUpdate: ['users:update', 'users:manage'],
  usersDelete: ['users:delete', 'users:manage'],
  usersPurge: ['users:purge'],
  // Trash holds restore (update/manage) + purge actions, so viewing it is
  // gated by either capability (matches the "Ver papelera" link gate).
  usersTrash: ['users:purge', 'users:manage'],
  groupsView: ['user-groups:read', 'user-groups:manage'],
  groupsCreate: ['user-groups:create', 'user-groups:manage'],
  groupsUpdate: ['user-groups:update', 'user-groups:manage'],
  groupsDelete: ['user-groups:delete', 'user-groups:manage'],
  groupsPurge: ['user-groups:purge'],
  groupsTrash: ['user-groups:purge', 'user-groups:manage'],
  clientsView: ['clients:read', 'clients:manage'],
  clientsCreate: ['clients:create', 'clients:manage'],
  clientsUpdate: ['clients:update', 'clients:manage'],
  clientsDelete: ['clients:delete', 'clients:manage'],
  clientsPurge: ['clients:purge'],
  clientsTrash: ['clients:purge', 'clients:manage'],
  servicesView: ['services:read', 'services:manage'],
  servicesCreate: ['services:create', 'services:manage'],
  servicesUpdate: ['services:update', 'services:manage'],
  servicesDelete: ['services:delete', 'services:manage'],
  servicesPurge: ['services:purge'],
  servicesTrash: ['services:purge', 'services:manage'],
  portfolioView: ['portfolio:read', 'portfolio:manage'],
  portfolioCreate: ['portfolio:create', 'portfolio:manage'],
  portfolioUpdate: ['portfolio:update', 'portfolio:manage'],
  portfolioDelete: ['portfolio:delete', 'portfolio:manage'],
  portfolioPurge: ['portfolio:purge'],
  portfolioTrash: ['portfolio:purge', 'portfolio:manage'],
  pagesView: ['pages:read', 'pages:manage'],
  pagesCreate: ['pages:create', 'pages:manage'],
  pagesUpdate: ['pages:update', 'pages:manage'],
  pagesDelete: ['pages:delete', 'pages:manage'],
  pagesPurge: ['pages:purge'],
  pagesTrash: ['pages:purge', 'pages:manage'],
  blogView: ['blog:read', 'blog:manage'],
  blogCreate: ['blog:create', 'blog:manage'],
  blogUpdate: ['blog:update', 'blog:manage'],
  blogDelete: ['blog:delete', 'blog:manage'],
  blogPurge: ['blog:purge'],
  blogTrash: ['blog:purge', 'blog:manage'],
  categoriesView: ['categories:read', 'categories:manage'],
  categoriesCreate: ['categories:create', 'categories:manage'],
  categoriesUpdate: ['categories:update', 'categories:manage'],
  categoriesDelete: ['categories:delete', 'categories:manage'],
  categoriesPurge: ['categories:purge'],
  categoriesTrash: ['categories:purge', 'categories:manage'],
  tagsView: ['tags:read', 'tags:manage'],
  tagsCreate: ['tags:create', 'tags:manage'],
  tagsUpdate: ['tags:update', 'tags:manage'],
  tagsDelete: ['tags:delete', 'tags:manage'],
  tagsPurge: ['tags:purge'],
  tagsTrash: ['tags:purge', 'tags:manage'],
  collaboratorsView: ['collaborators:read', 'collaborators:manage'],
  collaboratorsCreate: ['collaborators:create', 'collaborators:manage'],
  collaboratorsUpdate: ['collaborators:update', 'collaborators:manage'],
  collaboratorsDelete: ['collaborators:delete', 'collaborators:manage'],
  collaboratorsPurge: ['collaborators:purge'],
  collaboratorsTrash: ['collaborators:purge', 'collaborators:manage'],
  subscribersView: ['subscribers:read', 'subscribers:manage'],
  subscribersCreate: ['subscribers:create', 'subscribers:manage'],
  subscribersUpdate: ['subscribers:update', 'subscribers:manage'],
  subscribersDelete: ['subscribers:delete', 'subscribers:manage'],
  subscribersPurge: ['subscribers:purge'],
  subscribersTrash: ['subscribers:purge', 'subscribers:manage'],
  formsView: ['forms:read', 'forms:manage'],
  formsCreate: ['forms:create', 'forms:manage'],
  formsUpdate: ['forms:update', 'forms:manage'],
  formsDelete: ['forms:delete', 'forms:manage'],
  formsPurge: ['forms:purge'],
  formsTrash: ['forms:purge', 'forms:manage'],
  // Separate from forms* on purpose (matches the backend split): lets a
  // sales/support role triage submissions without editing the form itself.
  formSubmissionsView: ['forms-submissions:read', 'forms-submissions:manage'],
  formSubmissionsDelete: [
    'forms-submissions:delete',
    'forms-submissions:manage',
  ],
  formSubmissionsPurge: ['forms-submissions:purge'],
  mediaView: ['storage:read', 'storage:manage'],
  mediaUpload: ['storage:upload', 'storage:manage'],
  mediaDelete: ['storage:delete', 'storage:manage'],
  mediaPurge: ['storage:purge'],
  mediaTrash: ['storage:purge', 'storage:manage'],
  auditLogsView: ['audit-logs:read', 'audit-logs:manage'],
  appSettingsView: ['app-settings:read', 'app-settings:manage'],
  // 'site-config:languages' included so a role delegated ONLY the
  // content-language scope can still open the settings page.
  siteConfigView: [
    'site-config:read',
    'site-config:manage',
    'site-config:languages',
  ],
  siteConfigUpdate: ['site-config:update', 'site-config:manage'],
  siteConfigLanguagesUpdate: ['site-config:languages', 'site-config:manage'],
  // ─── Ecommerce ────────────────────────────────────────────────────────────
  ecommerceSettingsView: [
    'ecommerce-settings:read',
    'ecommerce-settings:manage',
  ],
  ecommerceSettingsUpdate: [
    'ecommerce-settings:update',
    'ecommerce-settings:manage',
  ],
  productCategoriesView: [
    'product-categories:read',
    'product-categories:manage',
  ],
  productCategoriesCreate: [
    'product-categories:create',
    'product-categories:manage',
  ],
  productCategoriesUpdate: [
    'product-categories:update',
    'product-categories:manage',
  ],
  productCategoriesDelete: [
    'product-categories:delete',
    'product-categories:manage',
  ],
  productCategoriesPurge: ['product-categories:purge'],
  productCategoriesTrash: [
    'product-categories:purge',
    'product-categories:manage',
  ],
  customersView: ['customers:read', 'customers:manage'],
  customersCreate: ['customers:create', 'customers:manage'],
  customersUpdate: ['customers:update', 'customers:manage'],
  customersDelete: ['customers:delete', 'customers:manage'],
  customersPurge: ['customers:purge'],
  customersTrash: ['customers:purge', 'customers:manage'],
  // Inventory covers both Location CRUD and Stock adjust/read under one
  // resource (matches the backend: no separate `stock:*` permission).
  inventoryView: ['inventory:read', 'inventory:manage'],
  inventoryCreate: ['inventory:create', 'inventory:manage'],
  inventoryUpdate: ['inventory:update', 'inventory:manage'],
  inventoryDelete: ['inventory:delete', 'inventory:manage'],
  inventoryPurge: ['inventory:purge'],
  inventoryTrash: ['inventory:purge', 'inventory:manage'],
  productsView: ['products:read', 'products:manage'],
  productsCreate: ['products:create', 'products:manage'],
  productsUpdate: ['products:update', 'products:manage'],
  productsDelete: ['products:delete', 'products:manage'],
  productsPurge: ['products:purge'],
  productsTrash: ['products:purge', 'products:manage'],
  couponsView: ['coupons:read', 'coupons:manage'],
  couponsCreate: ['coupons:create', 'coupons:manage'],
  couponsUpdate: ['coupons:update', 'coupons:manage'],
  couponsDelete: ['coupons:delete', 'coupons:manage'],
  couponsPurge: ['coupons:purge'],
  couponsTrash: ['coupons:purge', 'coupons:manage'],
  shippingView: ['shipping:read', 'shipping:manage'],
  shippingCreate: ['shipping:create', 'shipping:manage'],
  shippingUpdate: ['shipping:update', 'shipping:manage'],
  shippingDelete: ['shipping:delete', 'shipping:manage'],
  shippingPurge: ['shipping:purge'],
  shippingTrash: ['shipping:purge', 'shipping:manage'],
  // Payments covers both provider-config (read/update only, no create/purge —
  // the provider set is fixed by the backend registry) and
  // CustomerPaymentMethod full CRUD, under one `payments:*` resource.
  paymentProviderConfigView: ['payments:read', 'payments:manage'],
  paymentProviderConfigUpdate: ['payments:update', 'payments:manage'],
  paymentMethodsView: ['payments:read', 'payments:manage'],
  paymentMethodsCreate: ['payments:create', 'payments:manage'],
  paymentMethodsUpdate: ['payments:update', 'payments:manage'],
  paymentMethodsDelete: ['payments:delete', 'payments:manage'],
  paymentMethodsPurge: ['payments:purge'],
  paymentMethodsTrash: ['payments:purge', 'payments:manage'],
} as const
