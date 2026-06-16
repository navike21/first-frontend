import { Outlet } from '@tanstack/react-router'
import { useSessionSync, useNetworkStatus } from '@/shared/lib'
import { NetworkStatusBanner } from '@/shared/ui/molecules/NetworkStatusBanner'

export function RootLayout() {
  useSessionSync()
  useNetworkStatus()

  return (
    <>
      <NetworkStatusBanner />
      <Outlet />
    </>
  )
}
