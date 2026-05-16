import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/storage/')({
  component: StoragePage,
})

function StoragePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Storage</h1>
      <p className="text-[--color-muted] mt-2">Módulo en construcción.</p>
    </div>
  )
}
