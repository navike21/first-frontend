import { EProcessName } from '@Enums/processName'
import { EUrlPrivates } from '@Enums/urlPrivates'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { redirect } from '@tanstack/react-router'

export const handleValidateAuth = () => {
  const { isAuth, clearAuthInformation } = useAuthInformationStore.getState()
  const { setProcessName } = useOptionsBrowserStore.getState()
  if (isAuth) {
    setProcessName(EProcessName.HOME)
    throw redirect({
      to: EUrlPrivates.HOME_PAGE,
    })
  } else {
    clearAuthInformation()
  }
}
