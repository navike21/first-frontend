import { useAuth } from '@Hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router'

export type TPrivatePagesProviderProps = {
  children: ReactNode
}

export const PublicPagesProvider = ({
  children,
}: TPrivatePagesProviderProps) => {
  const { token, isLogged } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && isLogged) {
      navigate('/')
    }
  }, [isLogged, navigate, token])

  return <>{!token && !isLogged && children}</>
}
