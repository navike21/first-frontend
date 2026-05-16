import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@shared/api/client'
import { notify } from '@shared/lib/notify'
import type { ApiResponse } from '@shared/api/types'
import type { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput } from '../model/types'

export const teamKeys = {
  all: ['team'] as const,
  list: () => ['team', 'list'] as const,
  detail: (id: string) => ['team', id] as const,
}

export function useTeamMembers() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<TeamMember[]>>('/team')
      return data.data
    },
  })
}

export function useCreateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateTeamMemberInput) => {
      const { data } = await apiClient.post<ApiResponse<TeamMember>>('/team', input)
      return data.data
    },
    onSuccess: (member) => {
      void qc.invalidateQueries({ queryKey: teamKeys.all })
      notify.success(`Miembro "${member.name}" añadido`)
    },
  })
}

export function useUpdateTeamMember(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateTeamMemberInput) => {
      const { data } = await apiClient.patch<ApiResponse<TeamMember>>(`/team/${id}`, input)
      return data.data
    },
    onSuccess: (member) => {
      qc.setQueryData(teamKeys.detail(id), member)
      void qc.invalidateQueries({ queryKey: teamKeys.all })
      notify.success('Miembro actualizado')
    },
  })
}

export function useDeleteTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/team/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: teamKeys.all })
      notify.success('Miembro eliminado')
    },
  })
}
