export interface PortfolioTranslations {
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
    colStatus: string
    colServices: string
    colDate: string
    colOrder: string
    colActions: string
    editItem: string
    deleteItem: string
    viewItem: string
    restoreItem: string
    purgeItem: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    deletedAt: string
    selectAll: string
    selectRow: string
  }
  filters: {
    searchLabel: string
    statusLabel: string
    statusAll: string
    statusDraft: string
    statusPublished: string
    statusArchived: string
  }
  status: {
    draft: string
    published: string
    archived: string
  }
  actions: {
    newItem: string
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
    sectionContent: string
    sectionRelations: string
    sectionMedia: string
    sectionGlobal: string
    tabTranslations: string
    name: string
    shortDescription: string
    description: string
    slug: string
    slugHint: string
    technologies: string
    projectUrl: string
    serviceIds: string
    serviceIdsHint: string
    serviceNoTranslation: string
    clientId: string
    clientNoOptions: string
    startDate: string
    endDate: string
    featured: string
    order: string
    status: string
    cover: string
    coverUploadLabel: string
    coverDragLabel: string
    coverDragOrLabel: string
    coverBrowseLabel: string
    coverFormatsHint: string
    coverRemoveLabel: string
    coverRequired: string
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
    slugInvalid: string
    urlInvalid: string
    serviceRequired: string
  }
}
