import { Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Header'
import { Sidebar } from '@/widgets/Sidebar'
import { Footer } from '@/widgets/Footer'
import { Breadcrumbs } from '@/shared/ui'
import { useBreadcrumbs } from '@/shared/lib/useBreadcrumbs'
import clsx from 'clsx'

export const MainLayout = () => {
  const breadcrumbs = useBreadcrumbs()
  // usePresenceSocket() — disabled: Vercel serverless doesn't support persistent WebSocket
  const showBreadcrumbs = breadcrumbs.length > 1

  return (
    <div
      className={clsx(
        'flex h-screen w-full flex-col',
        'bg-surface-subtle text-foreground'
      )}
    >
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <main
            className={clsx(
              'flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto'
            )}
          >
            <div
              className={clsx(
                'mx-auto w-full max-w-7xl flex-1 space-y-6',
                'p-4 md:p-8'
              )}
            >
              {showBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              <Outlet />
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </div>
  )
}
