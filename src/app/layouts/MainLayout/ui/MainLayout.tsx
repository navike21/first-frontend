import { Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Header'
import { Sidebar } from '@/widgets/Sidebar'
import { Footer } from '@/widgets/Footer'
import { Breadcrumbs } from '@/shared/ui'
import { useBreadcrumbs } from '@/shared/lib/useBreadcrumbs'
import clsx from 'clsx'

export const MainLayout = () => {
  const breadcrumbs = useBreadcrumbs()
  const showBreadcrumbs = breadcrumbs.length > 1

  return (
    <div className={clsx('flex flex-col h-screen w-full bg-slate-50 text-slate-800')}>
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
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
