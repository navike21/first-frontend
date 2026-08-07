export interface CustomerTranslations {
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
    colEmail: string
    colPhone: string
    colStatus: string
    colActions: string
    editCustomer: string
    deleteCustomer: string
    viewCustomer: string
    restoreCustomer: string
    purgeCustomer: string
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
    newCustomer: string
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
    sectionGeneral: string
    firstName: string
    lastName: string
    email: string
    phone: string
    documentType: string
    documentTypeNone: string
    documentNumber: string
    notes: string
    isActive: string
    sectionAddresses: string
    addAddress: string
    removeAddress: string
    addressLabel: (index: number) => string
    addressType: string
    addressTypeShipping: string
    addressTypeBilling: string
    addressIsDefault: string
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
    firstNameRequired: string
    lastNameRequired: string
    emailInvalid: string
    documentNumberMax: string
    notesMax: string
  }
}
