type TEnvironments = {
  VITE_API_URL: string
  VITE_ENCRYPTION_KEY: string
  VITE_ENCRYPTION_IV: string
}

export const environments: TEnvironments = {
  VITE_API_URL: import.meta.env.VITE_API_URL as string,
  VITE_ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY as string,
  VITE_ENCRYPTION_IV: import.meta.env.VITE_ENCRYPTION_IV as string,
}
