import { Grid2 as Grid, Typography } from '@mui/material'
import { FormLogin, LoginContainer, FormContainer } from '../styles'
import { Button, InputText, Link, Logo, Password } from '@Components/index'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TLoginFields } from '../types'
import { loginSchema } from '../schema'
import { sanitizeInputEvent } from '@Utils/sanitizeInputEvent'
import { useTheme } from '@Hooks/useTheme'
import { loginForm } from '../language'
import { encryptData } from '@Utils/encryptAndDecryptData'
import { usePostLogin } from '../api/postLogin'

export const Login = () => {
  const { language } = useTheme()
  const {
    fields: { email, password, submit },
    title,
    links: { forgotPassword },
  } = loginForm[language]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFields>({
    mode: 'all',
    resolver: yupResolver(loginSchema(language)),
  })

  const { mutateAsync, isPending } = usePostLogin()

  const handleLogin: SubmitHandler<TLoginFields> = async (data) => {
    const dataLoginEncrypted = encryptData(JSON.stringify(data))

    await mutateAsync({
      data: {
        dataLoginEncrypted,
      },
    })
  }

  return (
    <LoginContainer>
      <FormContainer elevation={0} variant="elevation">
        <Grid display="flex" gap={2} flexDirection="column" alignItems="center">
          <Logo />
          <Grid
            display="flex"
            gap={1}
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h5" align="center">
              {title}
            </Typography>
          </Grid>
        </Grid>
        <FormLogin onSubmit={handleSubmit(handleLogin)}>
          <Grid display="flex" gap={2} flexDirection="column">
            <InputText
              error={errors}
              label={email.label}
              variant="outlined"
              autoComplete="username"
              type="email"
              disabled={isPending}
              {...register('email')}
              onInput={sanitizeInputEvent}
            />
            <Grid
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              gap={1}
            >
              <Link align="right" color="textPrimary">
                {forgotPassword}
              </Link>
              <Password
                label={password.label}
                error={errors}
                disabled={isPending}
                autoComplete="current-password"
                {...register('password')}
              />
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              loading={isPending}
            >
              {submit.label}
            </Button>
          </Grid>
        </FormLogin>
      </FormContainer>
    </LoginContainer>
  )
}
