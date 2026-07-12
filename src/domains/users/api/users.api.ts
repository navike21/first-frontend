import { request } from '@/shared/api'
import type { ApiResponse, PaginatedData } from '@/shared/api/types'
import type { User, UserListParams, UserMetadata } from '../model/user.types'
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from '../model/user.schema'

const BASE = '/users'

export const usersApi = {
  metadata: () =>
    request<ApiResponse<UserMetadata>>({
      api: `${BASE}/metadata`,
      method: 'GET',
    }),

  me: () =>
    request<ApiResponse<User>>({
      api: `${BASE}/me`,
      method: 'GET',
    }),

  list: (params: UserListParams = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.status) query.set('status', params.status)
    if (params.search) query.set('search', params.search)
    if (params.groupId) query.set('groupId', params.groupId)
    const qs = query.toString()
    return request<ApiResponse<PaginatedData<User>>>({
      api: qs ? `${BASE}?${qs}` : BASE,
      method: 'GET',
    })
  },

  getById: (id: string) =>
    request<ApiResponse<User>>({ api: `${BASE}/${id}`, method: 'GET' }),

  create: (body: CreateUserFormData, avatar?: File | null, avatarLibraryUrl?: string) => {
    type Created = ApiResponse<
      Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
    >
    // Multipart can't be serialised into the offline queue, so offline we send
    // JSON without the avatar (it gets queued); the page warns the photo was
    // skipped. Online with a photo still uses multipart.
    if (avatar && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('avatar', avatar)
      return request<Created, FormData>({ api: BASE, method: 'POST', body: fd })
    }
    const payload = avatarLibraryUrl ? { ...body, profilePictureUrl: avatarLibraryUrl } : body
    return request<Created, typeof payload>({
      api: BASE,
      method: 'POST',
      body: payload,
    })
  },

  update: (
    id: string,
    body: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean,
    avatarLibraryUrl?: string
  ) => {
    // Offline: skip multipart and send JSON so the edit is queued (the photo is
    // dropped and the page warns); online with a photo uses multipart.
    if (avatar && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('avatar', avatar)
      return request<ApiResponse<User>, FormData>({
        api: `${BASE}/${id}`,
        method: 'PATCH',
        body: fd,
      })
    }
    // Empty profilePictureUrl tells the backend to clear the existing avatar;
    // a library pick sets it directly.
    let payload: typeof body | (typeof body & { profilePictureUrl: string }) = body
    if (removeAvatar) payload = { ...body, profilePictureUrl: '' }
    else if (avatarLibraryUrl) payload = { ...body, profilePictureUrl: avatarLibraryUrl }
    return request<ApiResponse<User>, typeof payload>({
      api: `${BASE}/${id}`,
      method: 'PATCH',
      body: payload,
    })
  },

  softDelete: (id: string) =>
    request<ApiResponse<User>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  hardDelete: (id: string) =>
    request<ApiResponse<null>>({ api: `${BASE}/${id}`, method: 'DELETE' }),

  trash: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<ApiResponse<PaginatedData<User>>>({
      api: qs ? `${BASE}/trash?${qs}` : `${BASE}/trash`,
      method: 'GET',
    })
  },

  restore: (id: string) =>
    request<ApiResponse<User>>({
      api: `${BASE}/${id}/restore`,
      method: 'PATCH',
    }),

  purge: (id: string) =>
    request<ApiResponse<User>>({
      api: `${BASE}/${id}/permanent`,
      method: 'DELETE',
    }),

  bulkSoftDelete: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk`,
      method: 'DELETE',
      body: { ids },
    }),

  bulkRestore: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk/restore`,
      method: 'PATCH',
      body: { ids },
    }),

  bulkPurge: (ids: string[]) =>
    request<
      ApiResponse<{ processedIds: string[]; notFoundIds: string[] }>,
      { ids: string[] }
    >({
      api: `${BASE}/bulk/permanent`,
      method: 'DELETE',
      body: { ids },
    }),

  updateProfile: (
    body: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean,
    avatarLibraryUrl?: string
  ) => {
    if (avatar && navigator.onLine) {
      const fd = new FormData()
      fd.append('data', JSON.stringify(body))
      fd.append('avatar', avatar)
      return request<ApiResponse<User>, FormData>({
        api: `${BASE}/me`,
        method: 'PATCH',
        body: fd,
      })
    }
    let payload: typeof body | (typeof body & { profilePictureUrl: string }) = body
    if (removeAvatar) payload = { ...body, profilePictureUrl: '' }
    else if (avatarLibraryUrl) payload = { ...body, profilePictureUrl: avatarLibraryUrl }
    return request<ApiResponse<User>, typeof payload>({
      api: `${BASE}/me`,
      method: 'PATCH',
      body: payload,
    })
  },
}
