import { useAuth } from '@Hooks/useAuth'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const MainLayout = () => {
  const { token, isLogged } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token && !isLogged) {
      navigate('/login')
    }
  }, [isLogged, navigate, token])

  return (
    <>
      <Outlet />
    </>
  )
}
