import { URL_LOGIN } from '@Constants/publicPagesURL'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useNavigate } from '@tanstack/react-router'

export const useUserSession = () => {
  const { userInformation, clearAuthInformation } = useAuthInformationStore()

  const navigate = useNavigate({
    from: 'UserSession',
  })

  const handleLogout = () => {
    clearAuthInformation()
    navigate({
      to: URL_LOGIN,
      viewTransition: true,
    })
  }

  return { userInformation, handleLogout }
}
