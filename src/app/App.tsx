import { AppProviders } from './providers'
import { AppRouter } from './router'
import { AppDevtools } from './devtools'

export function App() {
  return (
    <AppProviders>
      <AppRouter />
      <AppDevtools />
    </AppProviders>
  )
}
