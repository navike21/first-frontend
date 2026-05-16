import { createFileRoute, redirect } from '@tanstack/react-router'
import { isTokenStored } from '@shared/model'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: isTokenStored() ? '/dashboard' : '/login', replace: true })
  },
})
