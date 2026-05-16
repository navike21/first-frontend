import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/chat/')({
  component: ChatPage,
})

function ChatPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Chat</h1>
      <p className="text-[--color-muted] mt-2">Módulo en construcción.</p>
    </div>
  )
}
