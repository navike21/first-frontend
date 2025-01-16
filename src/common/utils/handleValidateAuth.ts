import { URL_HOME_PAGE } from '@Constants/privatePagesURL'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { redirect } from '@tanstack/react-router'

export const handleValidateAuth = () => {
  const { isAuth } = useAuthInformationStore.getState()
  if (isAuth) {
    throw redirect({
      to: URL_HOME_PAGE,
    })
  }
}
