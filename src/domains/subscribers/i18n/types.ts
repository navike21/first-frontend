export interface SubscribersTranslations {
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
    colGender: string
    colStatus: string
    colActions: string
    editSubscriber: string
    deleteSubscriber: string
    viewSubscriber: string
    restoreSubscriber: string
    purgeSubscriber: string
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
  genders: {
    male: string
    female: string
    other: string
    prefer_not_to_say: string
  }
  actions: {
    newSubscriber: string
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
    sectionPersonal: string
    sectionContact: string
    sectionOptional: string
    firstName: string
    lastName: string
    gender: string
    email: string
    phoneNumber: string
    address: string
    dateOfBirth: string
    uploadPhoto: string
    uploadFormats: string
    removePhoto: string
    status: string
    select: string
    save: string
    create: string
    cancel: string
    back: string
    next: string
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
    nameMin: string
    nameMax: string
    emailInvalid: string
    phoneMin: string
    phoneMax: string
    addressMin: string
    addressMax: string
    urlInvalid: string
  }
}
