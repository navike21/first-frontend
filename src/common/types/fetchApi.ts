import { EHttpMethod } from '@Enums/httpMethod'

export type TApiResponse = {
  data: unknown
  status: number
  message: string
}

export type TErrorResponse = {
  status: number
  message: string
  data: unknown
}

export type TUseApiOptions<TBody> = {
  body?: TBody
  method: EHttpMethod
  path: string
  queryKey?: string[]
  showSuccessToast?: boolean
  unexpectedErrorMessage: string
  onSuccess?: (data: TApiResponse) => void
}
