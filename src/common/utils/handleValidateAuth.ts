import { EUrlPrivates } from '@Enums/urlPrivates'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { redirect } from '@tanstack/react-router'

export const handleValidateAuth = () => {
  const { isAuth, clearAuthInformation } = useAuthInformationStore.getState()
  if (isAuth) {
    throw redirect({
      to: EUrlPrivates.HOME_PAGE,
    })
  } else {
    clearAuthInformation()
  }
}
