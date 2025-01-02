import { Outlet } from '@tanstack/react-router'
import { Header } from './components/Header/Header'

export const PrivateLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
