export interface InventoryTranslations {
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
    stockTitle: string
    stockDescription: string
  }
  table: {
    noResults: string
    colName: string
    colType: string
    colFulfillsOnline: string
    colStatus: string
    colActions: string
    editLocation: string
    deleteLocation: string
    viewLocation: string
    restoreLocation: string
    purgeLocation: string
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
    warehouse: string
    store: string
  }
  actions: {
    newLocation: string
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
    fulfillsOnline: string
    isActive: string
    sectionAddress: string
    country: string
    region: string
    province: string
    address: string
    addressNumber: string
    addressInterior: string
    select: string
    save: string
    create: string
    cancel: string
  }
  stock: {
    productIdLabel: string
    productIdPlaceholder: string
    search: string
    total: string
    variant: string
    noVariant: string
    location: string
    quantity: string
    noResults: string
    adjustTitle: string
    adjustDescription: string
    productId: string
    variantId: string
    variantIdOptional: string
    submit: string
    updated: string
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
    nameRequired: string
    productIdInvalid: string
    variantIdInvalid: string
    locationRequired: string
    quantityInvalid: string
  }
}
