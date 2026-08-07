export interface ShippingTranslations {
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
    colType: string
    colAmount: string
    colStatus: string
    colOrder: string
    colActions: string
    editRule: string
    deleteRule: string
    viewRule: string
    restoreRule: string
    purgeRule: string
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
  type: {
    flat: string
    free_over_threshold: string
    by_zone: string
  }
  actions: {
    newRule: string
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
    name: string
    type: string
    amount: string
    amountHint: string
    freeOverAmount: string
    freeOverAmountHint: string
    zones: string
    zonesHint: string
    zoneRegion: string
    zoneProvinces: string
    zoneProvincesHint: string
    addZone: string
    removeZone: string
    isActive: string
    order: string
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
    freeOverAmountRequired: string
    zonesRequired: string
  }
}
