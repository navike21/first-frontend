import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@tanstack/react-router'
import { lazy, Suspense, type ReactNode } from 'react'
import { Providers } from '@app/providers'
import '@app/styles/globals.css'

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )
  : () => null

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'First — navike21' },
    ],
  }),
  component: RootComponent,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Providers>
        <Outlet />
        {import.meta.env.DEV && (
          <Suspense>
            <TanStackRouterDevtools position="bottom-right" />
          </Suspense>
        )}
      </Providers>
    </RootDocument>
  )
}
