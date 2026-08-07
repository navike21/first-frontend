import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { navPaths } from '@/shared/router'
import {
  useShippingRules,
  useSoftDeleteShippingRule,
  useBulkSoftDeleteShippingRules,
} from '../api/shippingRules.queries'
import { useShippingTranslation } from '../i18n'
import type {
  ShippingRule,
  ShippingRuleListParams,
  ShippingRulePaginationMeta,
} from '../model/shippingRule.types'

function statusValueFor(isActive: boolean | undefined): 'all' | 'active' | 'inactive' {
  if (isActive === undefined) return 'all'
  return isActive ? 'active' : 'inactive'
}

export function useShippingRulesPage() {
  const navigate = useNavigate()
  const { t, language } = useShippingTranslation()
  const [params, setParams] = useState<ShippingRuleListParams>({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [deletingRule, setDeletingRule] = useState<ShippingRule | null>(null)
  const [viewingRule, setViewingRule] = useState<ShippingRule | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false)

  const { data, isLoading, isFetching } = useShippingRules({
    ...params,
    search: search || undefined,
  })
  const softDelete = useSoftDeleteShippingRule()
  const bulkSoftDelete = useBulkSoftDeleteShippingRules()

  const rules = data?.data ?? []
  const meta = data?.meta as ShippingRulePaginationMeta | undefined
  const total = meta?.total ?? 0
  const pages = meta?.totalPages ?? 1
  const page = meta?.page ?? params.page ?? 1

  const clearSelection = () => setSelectedIds([])

  const handleView = (rule: ShippingRule) => setViewingRule(rule)
  const handleEdit = (rule: ShippingRule) =>
    navigate({ to: navPaths.shippingRuleEdit(rule.id, language) as never })
  const handleDelete = (rule: ShippingRule) => setDeletingRule(rule)

  const handleConfirmDelete = () => {
    if (!deletingRule) return
    softDelete.mutate(deletingRule.id, {
      onSuccess: () => {
        notify.success(t.toasts.deleted)
        setDeletingRule(null)
      },
      onError: onQueuedOr(() => setDeletingRule(null)),
    })
  }

  const handleConfirmBulkDelete = () => {
    bulkSoftDelete.mutate(selectedIds, {
      onSuccess: () => {
        notify.success(t.toasts.bulkDeleted)
        clearSelection()
        setBulkConfirmOpen(false)
      },
      onError: onQueuedOr(() => {
        clearSelection()
        setBulkConfirmOpen(false)
      }),
    })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setParams((p) => ({ ...p, page: 1 }))
    clearSelection()
  }

  const handleStatusChange = (value: string) => {
    setParams((p) => ({
      ...p,
      page: 1,
      isActive: value === 'all' ? undefined : value === 'active',
    }))
    clearSelection()
  }

  const handlePageChange = (next: number) => {
    setParams((p) => ({ ...p, page: next }))
    clearSelection()
  }

  const statusOptions = [
    { value: 'all', label: t.filters.statusAll },
    { value: 'active', label: t.filters.statusActive },
    { value: 'inactive', label: t.filters.statusInactive },
  ]

  const statusValue = statusValueFor(params.isActive)

  return {
    t,
    language,
    search,
    statusValue,
    rules,
    total,
    page,
    pages,
    isLoading,
    isFetching,
    deletingRule,
    viewingRule,
    selectedIds,
    bulkConfirmOpen,
    softDelete,
    bulkSoftDelete,
    statusOptions,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    setDeletingRule,
    setViewingRule,
    setSelectedIds,
    setBulkConfirmOpen,
    clearSelection,
  }
}
