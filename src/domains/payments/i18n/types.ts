export interface PaymentsTranslations {
  page: {
    methodsListTitle: string
    methodsListDescription: string
    methodsCreateTitle: string
    methodsCreateDescription: string
    methodsEditTitle: string
    methodsEditDescription: (brand: string) => string
    methodsTrashTitle: string
    methodsTrashDescription: string
    methodsTrashEmpty: string
    methodsTrashEmptyDescription: string
    providersTitle: string
    providersDescription: string
  }
  table: {
    noResults: string
    colCustomer: string
    colProvider: string
    colCard: string
    colExpiry: string
    colDefault: string
    colActions: string
    editMethod: string
    deleteMethod: string
    viewMethod: string
    restoreMethod: string
    purgeMethod: string
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
    providerLabel: string
    providerAll: string
  }
  status: {
    yes: string
    no: string
  }
  actions: {
    newMethod: string
    viewTrash: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    deleteTitle: string
    deleteDescription: (brand: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (brand: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (brand: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  form: {
    customerId: string
    provider: string
    providerToken: string
    providerTokenHint: string
    brand: string
    last4: string
    expiryMonth: string
    expiryYear: string
    isDefault: string
    save: string
    create: string
    cancel: string
    optional: string
    enabled: string
    secretFieldHint: string
    saveProvider: string
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
    providerUpdated: string
  }
  validation: {
    required: string
    last4Invalid: string
    expiryInvalid: string
  }
}
