'use client'

import { Grid2 as Grid, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, InputText, Link, Logo, Password } from '@Components/index'
import { sanitizeInputEvent } from '@Utils/sanitizeInputEvent'
import { encryptData } from '@Utils/encryptAndDecryptData'
import { useTheme } from '@Hooks/useTheme'
import { useAuth } from '@Hooks/useAuth'
import { FormLogin, LoginContainer, FormContainer } from '../styles'
import { TLoginFields } from '../types'
import { loginSchema } from '../schema'
import { loginForm } from '../language'
import { usePostLogin } from '../api/postLogin'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { PublicPagesProvider } from '@Providers/PublicPagesProvider'

export const Login = () => {
  const { token, isLogged } = useAuth()
  const navigate = useNavigate()

  const { language } = useTheme()
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
    links: { forgotPassword },
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

  const disabledFields = isPending || !!token

  useEffect(() => {
    const handleNavigation = async () => {
      if (token && isLogged) {
        navigate('/')
      }
    }
    handleNavigation()
  }, [isLogged, navigate, token])

  return (
    <PublicPagesProvider>
      <LoginContainer>
        <FormContainer elevation={0} variant="elevation">
          <Grid
            display="flex"
            gap={2}
            flexDirection="column"
            alignItems="center"
          >
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
                disabled={disabledFields}
                onInput={sanitizeInputEvent}
                {...register('email')}
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
                  disabled={disabledFields}
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
    </PublicPagesProvider>
  )
}
