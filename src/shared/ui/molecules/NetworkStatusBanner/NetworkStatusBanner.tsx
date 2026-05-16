import clsx from 'clsx'
import { RiWifiOffLine } from '@remixicon/react'
import { useNetworkStore } from '@/shared/model'

export const NetworkStatusBanner = () => {
  const isOnline = useNetworkStore((state) => state.isOnline)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isOnline ? undefined : 'Sin conexión a internet'}
      className={clsx(
        'fixed top-0 right-0 left-0 z-50',
        'flex items-center justify-center gap-2 px-4 py-2',
        'bg-amber-500 text-sm font-medium text-white',
        'transition-[translate] duration-300',
        isOnline ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <RiWifiOffLine size={16} aria-hidden="true" />
      <span>Sin conexión — los cambios se guardarán automáticamente</span>
    </div>
  )
}
