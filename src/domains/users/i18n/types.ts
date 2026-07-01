export interface UsersTranslations {
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
    colUser: string
    colEmail: string
    colStatus: string
    colPresence: string
    colActions: string
    editUser: string
    deleteUser: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    deletedAt: string
    selectAll: string
    selectRow: string
  }
  detail: {
    title: string
    closeButton: string
    /** Short label for the permanent-delete button inside the detail modal. */
    purgeButton: string
  }
  status: {
    active: string
    inactive: string
    deleted: string
  }
  presence: {
    available: string
    busy: string
    away: string
    offline: string
  }
  form: {
    tabPersonal: string
    tabAccount: string
    firstName: string
    lastName: string
    authSection: string
    email: string
    password: string
    confirmPassword: string
    newPassword: string
    passwordKeepHint: string
    phone: string
    dateOfBirth: string
    uploadPhoto: string
    uploadFormats: string
    removePhoto: string
    gender: string
    genderPlaceholder: string
    genderFemale: string
    genderMale: string
    genderOther: string
    genderPreferNotToSay: string
    groupId: string
    groupIdPlaceholder: string
    groupsEmpty: string
    addressSection: string
    addressStreet: string
    addressCity: string
    addressState: string
    addressCountry: string
    statusLabel: string
    statusDescription: string
    statusActive: string
    statusInactive: string
    createButton: string
    saveButton: string
    cancelButton: string
    back: string
    next: string
    optional: string
  }
  actions: {
    newUser: string
    deactivateTitle: string
    deactivateDescription: (firstName: string, lastName: string) => string
    confirmDeactivate: string
    cancel: string
    viewTrash: string
    restoreUser: string
    purgeUser: string
    restoreTitle: string
    restoreDescription: (name: string) => string
    purgeTitle: string
    purgeDescription: (name: string) => string
    confirmRestore: string
    confirmPurge: string
    purgeWarning: string
    selectedCount: (n: number) => string
    clearSelection: string
    viewDetail: string
    bulkDeactivate: string
    bulkDeactivateDescription: (n: number) => string
    bulkRestore: string
    bulkRestoreDescription: (n: number) => string
    bulkPurge: string
    bulkPurgeDescription: (n: number) => string
  }
  filters: {
    searchLabel: string
    searchPlaceholder: string
    statusLabel: string
    statusAll: string
    statusActive: string
    statusInactive: string
  }
  toasts: {
    created: string
    updated: string
    deactivated: string
    restored: string
    purged: string
    bulkDeactivated: string
    bulkRestored: string
    bulkPurged: string
    offlinePhotoSkipped: string
  }
  validation: {
    emailInvalid: string
    passwordMin: string
    passwordUppercase: string
    passwordNumber: string
    passwordMismatch: string
    required: string
    fieldMin2: string
    dateFormat: string
    urlInvalid: string
  }
}
