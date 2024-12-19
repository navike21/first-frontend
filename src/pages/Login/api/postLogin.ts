import { EHttpMethod } from '@Enums/httpMethod'
import { useApiMutation } from '@Hooks/useApi'
import { LOGIN_API_PATH } from '../constants'
import { useTheme } from '@Hooks/useTheme'
import { loginForm } from '../language'
import { TDataLogin } from '../types/responseLogin'
import { useAuth } from '@Hooks/useAuth'
import { useNavigate } from 'react-router'

export const usePostLogin = () => {
  const { language } = useTheme()
  const { setLogin } = useAuth()
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
      const { token, email, names } = data as TDataLogin
      setLogin({
        token,
        user: {
          email,
          names,
          role: '',
        },
      })

      navigate('/')
    },
  })
}
