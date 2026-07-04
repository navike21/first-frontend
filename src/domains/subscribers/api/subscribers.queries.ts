import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscribersApi } from './subscribers.api'
import type { SubscriberListParams } from '../model/subscriber.types'
import type { CreateSubscriberPayload } from '../model/subscriber.schema'

export const subscriberKeys = {
  all: ['subscribers'] as const,
  lists: () => [...subscriberKeys.all, 'list'] as const,
  list: (params: SubscriberListParams) => [...subscriberKeys.lists(), params] as const,
  details: () => [...subscriberKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriberKeys.details(), id] as const,
  trash: () => [...subscriberKeys.all, 'trash'] as const,
  trashList: (params: { page?: number; limit?: number }) =>
    [...subscriberKeys.trash(), params] as const,
}

export const useSubscribers = (params: SubscriberListParams = {}) =>
  useQuery({
    queryKey: subscriberKeys.list(params),
    queryFn: () => subscribersApi.list(params),
  })

export const useSubscriber = (id: string) =>
  useQuery({
    queryKey: subscriberKeys.detail(id),
    queryFn: () => subscribersApi.getById(id),
    select: (res) => res.data,
    enabled: !!id,
  })

export const useRegisterSubscriber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, photo }: { data: CreateSubscriberPayload; photo?: File | null }) =>
      subscribersApi.register(data, photo),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriberKeys.lists() }),
  })
}

export const useUpdateSubscriber = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, photo }: { data: Partial<CreateSubscriberPayload>; photo?: File | null }) =>
      subscribersApi.update(id, data, photo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriberKeys.lists() })
      qc.invalidateQueries({ queryKey: subscriberKeys.detail(id) })
    },
  })
}

export const useSoftDeleteSubscriber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscribersApi.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriberKeys.lists() })
      qc.invalidateQueries({ queryKey: subscriberKeys.trash() })
    },
  })
}

export const useSubscribersTrash = (params: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: subscriberKeys.trashList(params),
    queryFn: () => subscribersApi.trash(params),
  })

export const useRestoreSubscriber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscribersApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriberKeys.trash() })
      qc.invalidateQueries({ queryKey: subscriberKeys.lists() })
    },
  })
}

export const usePurgeSubscriber = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscribersApi.purge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriberKeys.trash() }),
  })
}

export const useBulkSoftDeleteSubscribers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => subscribersApi.bulkSoftDelete(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriberKeys.lists() })
      qc.invalidateQueries({ queryKey: subscriberKeys.trash() })
    },
  })
}

export const useBulkRestoreSubscribers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => subscribersApi.bulkRestore(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriberKeys.trash() })
      qc.invalidateQueries({ queryKey: subscriberKeys.lists() })
    },
  })
}

export const useBulkPurgeSubscribers = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => subscribersApi.bulkPurge(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: subscriberKeys.trash() }),
  })
}
