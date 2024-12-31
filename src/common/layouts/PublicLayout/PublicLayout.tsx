import { Outlet } from '@tanstack/react-router'
import { ContainerLayout } from './styles'

export const PublicLayout = () => {
  return (
    <ContainerLayout>
      <Outlet />
    </ContainerLayout>
  )
}
