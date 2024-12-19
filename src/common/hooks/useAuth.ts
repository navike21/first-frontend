import { useAuthStore } from '@Store/auth'

export const useAuth = () => {
  const isLogged = useAuthStore.getState().isLogged
  const user = useAuthStore.getState().user
  const token = useAuthStore.getState().token
  const setLogin = useAuthStore.getState().setLogin
  const setLogout = useAuthStore.getState().setLogout

  return {
    isLogged,
    user,
    token,
    setLogin,
    setLogout,
  }
}
