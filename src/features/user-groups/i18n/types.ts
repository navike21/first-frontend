export interface UserGroupsTranslations {
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
    colPermissions: string
    colStatus: string
    colActions: string
    viewGroup: string
    editGroup: string
    deleteGroup: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    permissionsCount: (n: number) => string
    systemBadge: string
    deletedAt: string
  }
  detail: {
    title: string
    descriptionLabel: string
    permissionsLabel: string
    noPermissions: string
    superadminNotice: string
    actionAll: string
    createdAt: string
    updatedAt: string
    editButton: string
    closeButton: string
  }
  status: { active: string; inactive: string }
  form: {
    name: string
    namePlaceholder: string
    description: string
    descriptionPlaceholder: string
    color: string
    permissions: string
    permissionsHint: string
    statusLabel: string
    statusDescription: string
    systemNotice: string
    createButton: string
    saveButton: string
    cancelButton: string
  }
  actions: {
    newGroup: string
    deleteTitle: string
    deleteDescription: (name: string) => string
    confirmDelete: string
    cancel: string
    viewTrash: string
    restoreGroup: string
    purgeGroup: string
    restoreTitle: string
    restoreDescription: (name: string) => string
    purgeTitle: string
    purgeDescription: (name: string) => string
    confirmRestore: string
    confirmPurge: string
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
    deleted: string
    restored: string
    purged: string
  }
  validation: {
    nameMin: string
    nameMax: string
    colorInvalid: string
  }
}
