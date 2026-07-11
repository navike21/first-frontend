export interface MediaTranslations {
  page: {
    listTitle: string
    listDescription: string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  grid: {
    empty: string
    selectAllLabel: string
    selectItemLabel: string
    deletedAtLabel: string
    totalCount: (count: number) => string
    prevPage: string
    nextPage: string
  }
  filters: {
    kindLabel: string
    kindAll: string
    kindImage: string
    kindVideo: string
    searchPlaceholder: string
  }
  actions: {
    viewTrash: string
    uploadFiles: string
    cancel: string
    selectedCount: (count: number) => string
    clearSelection: string
    bulkDelete: string
    bulkRestore: string
    bulkPurge: string
    viewItem: string
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
  upload: {
    title: string
    dragLabel: string
    dragOrLabel: string
    browseLabel: string
    formatsHint: string
    uploadButton: string
    uploadingLabel: string
    errorLabel: string
  }
  preview: {
    uploadedBy: string
    uploadedAt: string
    size: string
    type: string
    unknownUser: string
  }
  toasts: {
    uploaded: string
    deleted: string
    restored: string
    purged: string
    bulkDeleted: string
    bulkRestored: string
    bulkPurged: string
  }
}
