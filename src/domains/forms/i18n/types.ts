export interface FormsTranslations {
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
    submissionsTitle: (name: string) => string
    submissionsDescription: string
  }
  table: {
    noResults: string
    colTitle: string
    colStatus: string
    colFields: string
    colSubmissions: string
    colActions: string
    editForm: string
    deleteForm: string
    viewForm: string
    restoreForm: string
    purgeForm: string
    viewSubmissions: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    deletedAt: string
    selectAll: string
    selectRow: string
  }
  submissionsTable: {
    noResults: string
    colDate: string
    colStatus: string
    colPreview: string
    colActions: string
    statusRead: string
    statusUnread: string
    viewSubmission: string
    markRead: string
    deleteSubmission: string
    deleteSubmissionDescription: string
    restoreSubmission: string
    purgeSubmission: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
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
    readLabel: string
    readAll: string
    readRead: string
    readUnread: string
  }
  status: {
    active: string
    inactive: string
  }
  fieldTypes: {
    text: string
    textarea: string
    email: string
    phone: string
    select: string
    radio: string
    checkbox: string
    date: string
  }
  actions: {
    newForm: string
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
    sectionFields: string
    sectionNotifications: string
    title: string
    description: string
    successMessage: string
    status: string
    notificationEmails: string
    notificationEmailsHint: string
    addField: string
    noFields: string
    fieldLabel: string
    fieldPlaceholder: string
    fieldType: string
    fieldRequired: string
    fieldMaxLength: string
    fieldOptions: string
    addOption: string
    optionValue: string
    optionLabel: string
    dragField: string
    removeField: string
    removeOption: string
    save: string
    create: string
    cancel: string
  }
  submissionDetail: {
    title: string
    submittedAt: string
    ipAddress: string
    userAgent: string
    close: string
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
    markedRead: string
  }
  validation: {
    required: string
    fieldsMin: string
    optionsRequired: string
  }
}
