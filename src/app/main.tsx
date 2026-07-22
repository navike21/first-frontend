import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/index.css'
import { App } from './App'

// Offline-first: register the service worker that precaches the app shell so
// the app loads without network. No-op in dev (devOptions disabled).
//
// Update as soon as one is found, not on Workbox's default schedule (wait
// until every tab of this origin closes) — a long-lived open tab (common on
// mobile) could otherwise never pick up a new deploy. Also poll for updates
// periodically: a registration only checks once on its own, so a tab left
// open for a while would never discover a newer version without this.
const UPDATE_CHECK_INTERVAL_MS = 60 * 1000

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    setInterval(() => {
      registration.update().catch(() => {})
    }, UPDATE_CHECK_INTERVAL_MS)
  },
})

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
