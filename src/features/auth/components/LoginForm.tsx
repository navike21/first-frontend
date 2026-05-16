import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { useState } from 'react'
import { loginSchema, type LoginInput } from '../model/types'
import { useLogin } from '../api'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { mutate: login, isPending } = useLogin()

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
        void navigate({ to: '/dashboard' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="admin@navike21.com"
        leftIcon={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        rightIcon={
          <button
            type="button"
            aria-label={showPassword ? 'ocultar contraseña' : 'mostrar contraseña'}
            onClick={() => setShowPassword((v) => !v)}
            className="text-[--color-muted] hover:text-[--color-foreground] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register('password')}
      />
      <Button type="submit" fullWidth loading={isPending} className="mt-2">
        Iniciar sesión
      </Button>
    </form>
  )
}
