export interface ProductReviewTranslations {
  page: {
    listTitle: string
    listDescription: string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  table: {
    noResults: string
    colProduct: string
    colReviewer: string
    colRating: string
    colStatus: string
    colDate: string
    colActions: string
    viewReview: string
    approveReview: string
    rejectReview: string
    deleteReview: string
    restoreReview: string
    purgeReview: string
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
  }
  status: {
    pending: string
    approved: string
    rejected: string
  }
  actions: {
    viewTrash: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    deleteTitle: string
    deleteDescription: (reviewer: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (reviewer: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (reviewer: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  detail: {
    title: string
    product: string
    reviewer: string
    email: string
    rating: string
    comment: string
    status: string
    submittedAt: string
    close: string
  }
  toasts: {
    approved: string
    rejected: string
    deleted: string
    restored: string
    purged: string
    bulkDeleted: string
    bulkRestored: string
    bulkPurged: string
  }
}
