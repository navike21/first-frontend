type TEnvironments = {
  VITE_API_URL: string
}

export const environments: TEnvironments = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
}
