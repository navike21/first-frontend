import { router } from '@Router/routers'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

declare module '@tanstack/react-router' {
  interface IRegister {
    router: typeof router
  }
}

export const ReactRouterProvider = () => (
  <>
    <RouterProvider router={router} />
    <TanStackRouterDevtools initialIsOpen={false} router={router} />
  </>
)
