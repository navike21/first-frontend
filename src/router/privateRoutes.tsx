import { Title } from '@Components/Title/Title'
import { createRoute } from '@tanstack/react-router'
import { privateRoute } from './routers'

export const dashboardRoute = createRoute({
  getParentRoute: () => privateRoute,
  path: '/',
  component: function Dashboard() {
    return (
      <div className="p-2">
        <Title>Dashboard</Title>
      </div>
    )
  },
})
