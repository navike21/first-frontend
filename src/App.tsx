import { useSystemTheme } from '@Hooks/useSystemTheme'
import { mainRouter } from '@Routes/mainRouters'
import { MuiThemeProvider } from '@Providers/MuiThemeProvider'
import { RouterProvider } from 'react-router-dom'
import { ToasterContent } from '@Components/ToasterContent'
import { ReactQueryProvider } from '@Providers/ReactQueryProvider'

export function App() {
  useSystemTheme()

  return (
    <ReactQueryProvider>
      <MuiThemeProvider>
        <RouterProvider router={mainRouter} />
        <ToasterContent />
      </MuiThemeProvider>
    </ReactQueryProvider>
  )
}
