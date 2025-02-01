import { EHttpMethod } from '@Enums/httpMethod'
import { useApiMutation } from '@Hooks/useApi'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useNavigate } from '@tanstack/react-router'
import { LOGIN_API_PATH } from '../constants/apiPath'
import { TDataLogin } from '../styles/responseLogin'
import { loginForm } from '../languages/loginForm'
import { EUrlPrivate } from '@Enums/urlPrivates'
import { EProcessName } from '@Enums/processName'

export const usePostLogin = () => {
  const { language, setProcessName } = useOptionsBrowserStore()
  const { setLogin } = useAuthInformationStore()
  const navigate = useNavigate()

  const {
    api: {
      error: { unexpected },
    },
  } = loginForm[language]

  return useApiMutation({
    method: EHttpMethod.POST,
    path: LOGIN_API_PATH,
    queryKey: ['login'],
    unexpectedErrorMessage: unexpected,
    onSuccess: ({ data }) => {
      const { token, email, names, fatherLastName, motherLastName } =
        data as TDataLogin
      setLogin({
        isAuth: true,
        token,
        userInformation: {
          email,
          names,
          fatherLastName,
          motherLastName,
          avatar: '',
          role: '',
        },
      })

      setProcessName(EProcessName.HOME)
      navigate({
        to: EUrlPrivate.HOME_PAGE,
      })
    },
  })
}
