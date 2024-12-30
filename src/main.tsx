import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MUIProvider } from '@Providers/MUIProvider.tsx'
import { ReactQueryProvider } from '@Providers/ReactQueryProvider.tsx'
import App from './App.tsx'
import './index.css'
import { ToasterContent } from '@Components/ToasterContent/ToasterContent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <MUIProvider>
        <App />
        <ToasterContent richColors />
      </MUIProvider>
    </ReactQueryProvider>
  </StrictMode>
)
