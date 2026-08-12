export interface OrderTranslations {
  page: {
    listTitle: string
    listDescription: string
    createTitle: string
    createDescription: string
    detailTitle: (orderNumber: string) => string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  table: {
    noResults: string
    colOrderNumber: string
    colCustomer: string
    colStatus: string
    colPaymentStatus: string
    colTotal: string
    colDate: string
    colActions: string
    viewOrder: string
    deleteOrder: string
    restoreOrder: string
    purgeOrder: string
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
    paymentStatusLabel: string
    paymentStatusAll: string
  }
  status: {
    pending: string
    confirmed: string
    processing: string
    shipped: string
    delivered: string
    cancelled: string
    refunded: string
  }
  paymentStatus: {
    unpaid: string
    partially_paid: string
    paid: string
    refunded: string
  }
  actions: {
    newOrder: string
    viewTrash: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    deleteTitle: string
    deleteDescription: (orderNumber: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (orderNumber: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (orderNumber: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  builder: {
    stepCustomer: string
    stepItems: string
    stepShipping: string
    stepReview: string
    customerLabel: string
    customerPlaceholder: string
    locationLabel: string
    locationPlaceholder: string
    productLabel: string
    productPlaceholder: string
    variantLabel: string
    quantityLabel: string
    addItem: string
    removeItem: string
    itemsEmpty: string
    itemsSubtotal: string
    colProduct: string
    colVariant: string
    colUnitPrice: string
    colQuantity: string
    colLineTotal: string
    shippingAddressTitle: string
    billingAddressTitle: string
    sameBillingAddress: string
    country: string
    region: string
    province: string
    district: string
    address: string
    addressNumber: string
    addressInterior: string
    couponCode: string
    couponCodeHint: string
    notes: string
    reviewCustomer: string
    reviewLocation: string
    reviewItems: string
    reviewEstimatedSubtotal: string
    reviewEstimatedNote: string
    back: string
    next: string
    create: string
    cancel: string
    optional: string
  }
  detail: {
    backToList: string
    orderNumberLabel: string
    customerLabel: string
    locationLabel: string
    createdAtLabel: string
    statusLabel: string
    paymentStatusLabel: string
    changeStatusTo: string
    changePaymentStatusTo: string
    trackingNumberLabel: string
    trackingNumberPlaceholder: string
    updateStatus: string
    updatePaymentStatus: string
    itemsTitle: string
    colProduct: string
    colSku: string
    colUnitPrice: string
    colQuantity: string
    colLineTotal: string
    totalsTitle: string
    subtotal: string
    discount: string
    shipping: string
    tax: string
    total: string
    shippingAddressTitle: string
    billingAddressTitle: string
    notesTitle: string
    noNotes: string
    noNextStatus: string
    noNextPaymentStatus: string
  }
  toasts: {
    created: string
    statusUpdated: string
    paymentStatusUpdated: string
    deleted: string
    restored: string
    purged: string
    bulkDeleted: string
    bulkRestored: string
    bulkPurged: string
  }
  validation: {
    required: string
    itemsRequired: string
    itemQuantityInvalid: string
    addressIncomplete: string
  }
}
