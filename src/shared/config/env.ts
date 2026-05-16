export const env = {
  VITE_API_URL: import.meta.env.VITE_API_URL as string,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL as string,
  VITE_APP_NAME: (import.meta.env.VITE_APP_NAME as string) ?? 'First',
  VITE_APP_ENV: (import.meta.env.VITE_APP_ENV as string) ?? 'development',
  VITE_AUTH_PROVIDER: (import.meta.env.VITE_AUTH_PROVIDER as string) ?? 'fake',
}
