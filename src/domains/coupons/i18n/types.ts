export interface CouponTranslations {
  page: {
    listTitle: string
    listDescription: string
    createTitle: string
    createDescription: string
    editTitle: string
    editDescription: (code: string) => string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  table: {
    noResults: string
    colCode: string
    colType: string
    colValue: string
    colStatus: string
    colUsage: string
    colActions: string
    editCoupon: string
    deleteCoupon: string
    viewCoupon: string
    restoreCoupon: string
    purgeCoupon: string
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
    percentage: string
    fixed: string
  }
  scope: {
    cart: string
    products: string
    categories: string
  }
  actions: {
    newCoupon: string
    viewTrash: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    deleteTitle: string
    deleteDescription: (code: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (code: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (code: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  form: {
    code: string
    type: string
    value: string
    valuePercentageHint: string
    valueFixedHint: string
    maxDiscountAmount: string
    maxDiscountAmountHint: string
    usageLimitTotal: string
    usageLimitPerCustomer: string
    startsAt: string
    expiresAt: string
    isStackable: string
    scopeType: string
    targetIdsProducts: string
    targetIdsCategories: string
    status: string
    timesUsed: string
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
    codeMinLength: string
    codeMaxLength: string
    percentageMax: string
    scopeTargetsRequired: string
    dateRangeInvalid: string
  }
}
