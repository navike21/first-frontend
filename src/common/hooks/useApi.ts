import { EHttpMethod } from '@Enums/httpMethod'
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
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

const handleFetchResponse = async (
  response: Response
): Promise<TApiResponse> => {
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
}

const fetchData = async <TBody>(
  path: string,
  method: EHttpMethod,
  language: string,
  body?: TBody
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': language,
  }

  const config: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  }

  const response = await fetch(path, config)
  return handleFetchResponse(response)
}

export const useApiQuery = ({
  method,
  path,
  queryKey = ['api'],
  unexpectedErrorMessage,
  showSuccessToast = true,
  onSuccess: onSuccessProp,
}: TUseApiOptions<unknown>) => {
  const { language } = useTheme()
  const { openToast } = useToast()
  return useQuery<TApiResponse, Error>({
    ...({
      queryKey,
      queryFn: () => fetchData(path, method, language),
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
      onError: (error: unknown) => {
        const { status, message } = error as unknown as TErrorResponse
        openToast({
          type: getStatusType(status),
          message: status ? message : unexpectedErrorMessage,
        })
      },
    } as UseQueryOptions<TApiResponse, Error>),
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
    mutationFn: (body: TBody) => fetchData(path, method, language, body),
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
