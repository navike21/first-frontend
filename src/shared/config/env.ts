import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_SOCKET_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('First'),
  VITE_APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables. Check .env file.')
}

export const env = parsed.data
