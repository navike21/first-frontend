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
    <div className={clsx('flex h-screen w-full flex-col', 'bg-(--surface-subtle) text-(--text-primary)')}>
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <main className={clsx('flex-1 w-full overflow-y-auto', 'p-4', 'md:p-8')}>
            <div className={clsx('w-10/12 max-w-7xl mx-auto space-y-6', 'md:w-full')}>
              {showBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              <Outlet />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  )
}
