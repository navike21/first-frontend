export interface CollaboratorTranslations {
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
    colRole: string
    colStatus: string
    colActions: string
    editCollaborator: string
    deleteCollaborator: string
    viewCollaborator: string
    restoreCollaborator: string
    purgeCollaborator: string
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
    newCollaborator: string
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
    tabTranslations: string
    name: string
    role: string
    level: string
    bio: string
    order: string
    isActive: string
    uploadPhoto: string
    uploadFormats: string
    removePhoto: string
    sectionSocial: string
    linkedin: string
    twitter: string
    github: string
    website: string
    instagram: string
    sectionAccount: string
    linkedUser: string
    linkedUserHint: string
    noLinkedUser: string
    select: string
    save: string
    create: string
    cancel: string
    optional: string
  }
  mediaLibrary: {
    titleImage: string
    titleVideo: string
    searchPlaceholder: string
    empty: string
    selectLabel: string
    prevPage: string
    nextPage: string
    uploadNewLabel: string
    uploadNewHint: string
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
    offlinePhotoSkipped: string
  }
  validation: {
    required: string
    nameMax: string
    urlInvalid: string
  }
}
