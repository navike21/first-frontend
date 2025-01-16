import { MUIProvider } from '@Providers/MUIProvider'
import { ReactQueryProvider } from '@Providers/ReactQueryProvider'
import { ReactRouterProvider } from '@Providers/ReactRouterProvider'
import { ToasterContent } from '@Components/ToasterContent/ToasterContent.tsx'

export const App = () => {
  return (
    <MUIProvider>
      <ReactQueryProvider>
        <ReactRouterProvider />
        <ToasterContent richColors />
      </ReactQueryProvider>
    </MUIProvider>
  )
}
