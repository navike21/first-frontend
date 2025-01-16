import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { environments } from '@Constants/environments'
import { router } from '@Router/routers'

declare module '@tanstack/react-router' {
  interface IRegister {
    router: typeof router
  }
}

export const ReactRouterProvider = () => (
  <>
    <RouterProvider router={router} />
    {environments.VITE_ENV === 'development' && (
      <TanStackRouterDevtools initialIsOpen={false} router={router} />
    )}
  </>
)
