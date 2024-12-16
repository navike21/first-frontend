import { EHttpMethod } from '@Enums/httpMethod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTheme } from './useTheme'
import { useToast } from './useToast'
import { getStatusType } from '@Utils/getStatusType'

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

export const useApiQuery = ({
  method,
  path,
  queryKey = ['api'],
}: TUseApiOptions<unknown>) => {
  const { language } = useTheme()
  return useQuery<TApiResponse, Error>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw {
          status: response.status,
          ...JSON.parse(errorText),
        }
      }

      return {
        ...(await response.json()),
        status: response.status,
      }
    },
    retry: 1,
  })
}

export const useApiMutation = <TBody>({
  method,
  path,
  queryKey,
  unexpectedErrorMessage,
  showSuccessToast = true,
  onSuccess: onSuccessProp,
}: TUseApiOptions<TBody>) => {
  const { language } = useTheme()
  const { openToast } = useToast()
  return useMutation<TApiResponse, Error, TBody>({
    mutationFn: async (body: TBody) => {
      const response = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw {
          status: response.status,
          ...JSON.parse(errorText),
        }
      }

      return {
        ...(await response.json()),
        status: response.status,
      }
    },
    onSuccess: (data: TApiResponse) => {
      if (onSuccessProp) {
        onSuccessProp(data)
      }
      if (showSuccessToast) {
        const { status, message } = data
        openToast({
          type: getStatusType(status),
          message,
        })
      }
    },
    onError: (error) => {
      const { status, message } = error as unknown as TErrorResponse
      openToast({
        type: getStatusType(status),
        message: status ? message : unexpectedErrorMessage,
      })
    },
    mutationKey: queryKey,
  })
}
