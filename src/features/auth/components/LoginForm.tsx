import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Button, InputField } from '@shared/ui'
import { loginSchema, type LoginInput } from '../model/types'
import { useLogin } from '../api'

export function LoginForm() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginInput) {
    login(data, {
      onSuccess: () => {
        navigate({ to: '/dashboard' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <InputField
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="usuario@navike21.com"
        variant={errors.email ? 'error' : 'default'}
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      <InputField
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        variant={errors.password ? 'error' : 'default'}
        errorMessage={errors.password?.message}
        {...register('password')}
      />

      {error && (
        <p role="alert" className="text-sm text-red-500 text-center -mt-2">
          {error instanceof Error ? error.message : 'Error al iniciar sesión'}
        </p>
      )}

      <Button type="submit" variant="primary" size="medium" fullWidth loading={isPending}>
        {isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
