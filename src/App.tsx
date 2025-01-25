import { MUIProvider } from '@Providers/MUIProvider'
import { ReactQueryProvider } from '@Providers/ReactQueryProvider'
import { ReactRouterProvider } from '@Providers/ReactRouterProvider'
import { ToasterContent } from '@Components/ToasterContent/ToasterContent.tsx'
import { Suspense } from 'react'

export const App = () => {
  return (
    <MUIProvider>
      <ReactQueryProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <ReactRouterProvider />
        </Suspense>
        <ToasterContent richColors />
      </ReactQueryProvider>
    </MUIProvider>
  )
}
