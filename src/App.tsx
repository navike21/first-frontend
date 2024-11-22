import { useSystemTheme } from '@Hooks/useSystemTheme'
import { mainRouter } from '@Routes/mainRouters'
import { MuiThemeProvider } from '@Providers/MuiThemeProvider'
import { RouterProvider } from 'react-router-dom'

export function App() {
  useSystemTheme()

  return (
    <MuiThemeProvider>
      <RouterProvider
        router={mainRouter}
        future={{
          v7_startTransition: true,
        }}
      />
    </MuiThemeProvider>
  )
}
