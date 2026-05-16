import { Amplify } from 'aws-amplify'

export function configureAmplify(): void {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
        loginWith: { email: true },
      },
    },
  })
}
