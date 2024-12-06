import { Button, Grid2 as Grid, Paper, Typography } from '@mui/material'
import { FormContainer, formContainer, loginContainer } from './styles'
import { InputText, Link, Logo, Password } from '@Components/index'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TLoginFields } from './types'
import { loginSchema } from './schema'
import { sanitizeInputEvent } from '@Utils/sanitizeInputEvent'

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFields>({
    mode: 'all',
    resolver: yupResolver(loginSchema()),
  })

  const handleLogin: SubmitHandler<TLoginFields> = (data) => {
    console.log(data)
  }

  return (
    <Grid sx={loginContainer}>
      <Paper elevation={0} variant="elevation" sx={formContainer}>
        <Grid display="flex" gap={2} flexDirection="column" alignItems="center">
          <Logo />
          <Grid
            display="flex"
            gap={1}
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h5" align="center">
              Sign in to your account
            </Typography>
            <Typography color="textSecondary" align="center">
              Don’t have an account? <Link>Get started</Link>
            </Typography>
          </Grid>
        </Grid>
        <FormContainer onSubmit={handleSubmit(handleLogin)}>
          <Grid display="flex" gap={2} flexDirection="column">
            <InputText
              error={errors}
              label="Email"
              variant="outlined"
              autoComplete="username"
              type="email"
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
                Forgot password?
              </Link>
              <Password
                label="Password"
                error={errors}
                autoComplete="current-password"
                {...register('password')}
              />
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Sign in
            </Button>
          </Grid>
        </FormContainer>
      </Paper>
    </Grid>
  )
}
