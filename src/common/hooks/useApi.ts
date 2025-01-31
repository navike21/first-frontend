import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TApiResponse, TErrorResponse, TUseApiOptions } from '@Types/fetchApi'
import { getStatusType } from '@Utils/getStatusType'
import { fetchData } from '@Utils/fetchData'
import { useToast } from './useToast'

export const useApiQuery = ({
  method,
  path,
  queryKey = ['api'],
  unexpectedErrorMessage,
  showSuccessToast = true,
  onSuccess: onSuccessProp,
}: TUseApiOptions<unknown>) => {
  const { language } = useOptionsBrowserStore()

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
        const { status, message } = error as TErrorResponse
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
  const { language } = useOptionsBrowserStore()
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
    onError: (error: unknown) => {
      const { status, message } = error as TErrorResponse
      openToast({
        type: getStatusType(status),
        message: status ? message : unexpectedErrorMessage,
      })
    },
    mutationKey: queryKey,
  })
}
