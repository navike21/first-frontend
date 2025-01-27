import { Button } from '@Components/Button/Button'
import { Logo } from '@Components/Logo/Logo'
import { Title } from '@Components/Title/Title'
import { InputText } from '@Components/InputText/InputText'
import { InputPassword } from '@Components/inputPassword/inputPassword'
import { FormContainer, FormLogin, LoginBackground } from './styles/styles'
import { ESizes } from '@Enums/size'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { sanitizeInputEvent } from '@Utils/sanitizeInputEvent'
import { encryptData } from '@Utils/encryptAndDecryptData'
import { usePostLogin } from './api/postLogin'
import { loginSchema } from './schemas/schemas'
import { TLoginFields } from './types/types'
import { loginForm } from './languages/loginForm'

export const Login = () => {
  const { language } = useOptionsBrowserStore()
  const { mutateAsync, isPending } = usePostLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLoginFields>({
    mode: 'all',
    resolver: yupResolver(loginSchema(language)),
    defaultValues: {
      email: 'ivan@navike21.com',
      password: '12346',
    },
  })

  const {
    fields: { email, password, submit },
    title,
  } = loginForm[language]

  const handleLogin: SubmitHandler<TLoginFields> = async (data) => {
    const dataLoginEncrypted = encryptData(JSON.stringify(data))
    await mutateAsync({
      data: {
        dataLoginEncrypted,
      },
    }).catch(() => {
      reset()
    })
  }

  return (
    <>
      <LoginBackground />
      <FormContainer elevation={0} variant="outlined">
        <Logo showRadar size={ESizes.LG} direction="column" />
        <Title variant="h5">{title}</Title>
        <FormLogin onSubmit={handleSubmit(handleLogin)}>
          <InputText
            error={errors}
            label={email.label}
            variant="outlined"
            autoComplete="username"
            type="email"
            disabled={isPending}
            onInput={sanitizeInputEvent}
            {...register('email')}
          />

          <InputPassword
            error={errors}
            label={password.label}
            disabled={isPending}
            {...register('password')}
          />
          <Button
            fullWidth
            type="submit"
            loading={isPending}
          >{`${submit.label}`}</Button>
        </FormLogin>
      </FormContainer>
    </>
  )
}
