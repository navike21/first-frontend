export interface CategoryTranslations {
  page: {
    listTitle: string
    listDescription: string
    createTitle: string
    createDescription: string
    editTitle: string
    editDescription: (name: string) => string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  table: {
    noResults: string
    colName: string
    colSlug: string
    colParent: string
    colStatus: string
    colActions: string
    editCategory: string
    deleteCategory: string
    viewCategory: string
    restoreCategory: string
    purgeCategory: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    deletedAt: string
    selectAll: string
    selectRow: string
  }
  filters: {
    searchLabel: string
    searchPlaceholder: string
    statusLabel: string
    statusAll: string
    statusActive: string
    statusInactive: string
  }
  status: {
    active: string
    inactive: string
  }
  actions: {
    newCategory: string
    viewTrash: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    deleteTitle: string
    deleteDescription: (name: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (name: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (name: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  form: {
    tabTranslations: string
    name: string
    slug: string
    parent: string
    noParent: string
    order: string
    isActive: string
    select: string
    save: string
    create: string
    cancel: string
    optional: string
  }
  toasts: {
    created: string
    updated: string
    deleted: string
    restored: string
    purged: string
    bulkDeleted: string
    bulkRestored: string
    bulkPurged: string
  }
  validation: {
    required: string
    slugInvalid: string
  }
}
