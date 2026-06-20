import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/index.css'
import { App } from './App'

// Offline-first: register the service worker that precaches the app shell so
// the app loads without network. No-op in dev (devOptions disabled); the SW
// auto-updates on new deploys.
registerSW({ immediate: true })

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
