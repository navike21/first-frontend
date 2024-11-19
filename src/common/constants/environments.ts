type TEnvironments = {
  [key: string]: string | undefined
}

export const environments: TEnvironments = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
}
