import { useAuthStore } from '@Store/auth'

export const useAuth = () => {
  const isLogged = useAuthStore((state) => state.isLogged)
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setLogin = useAuthStore((state) => state.setLogin)
  const setLogout = useAuthStore((state) => state.setLogout)

  return {
    isLogged,
    user,
    token,
    setLogin,
    setLogout,
  }
}
