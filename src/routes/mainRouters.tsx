import { MainLayout } from '@Layouts/MainLayout'
import { Login } from '@Pages/Login'
import { createBrowserRouter } from 'react-router-dom'

export const mainRouter = createBrowserRouter(
  [
    {
      id: 'home',
      path: '/',
      element: <MainLayout />,
      children: [
        {
          caseSensitive: true,
          element: <div>Hola</div>,
          path: 'contact',
        },
      ],
    },
    {
      id: 'login',
      path: '/login',
      element: <Login />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
)
