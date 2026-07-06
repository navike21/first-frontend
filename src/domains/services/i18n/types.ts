export interface ServicesTranslations {
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
    colPillars: string
    colOrder: string
    colActions: string
    editService: string
    deleteService: string
    viewService: string
    restoreService: string
    purgeService: string
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
  pillars: {
    responsibility: string
    people: string
    'continuous-learning': string
    'tech-adaptation': string
    'digital-experience': string
    'business-growth': string
  }
  actions: {
    newService: string
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
    sectionMedia: string
    tabTranslations: string
    sectionGlobal: string
    name: string
    shortDescription: string
    description: string
    slug: string
    slugHint: string
    pillars: string
    tags: string
    tagsHint: string
    order: string
    isActive: string
    status: string
    cover: string
    coverUploadLabel: string
    coverDragLabel: string
    coverBrowseLabel: string
    coverFormatsHint: string
    coverRemoveLabel: string
    icon: string
    iconUploadLabel: string
    iconDragLabel: string
    iconBrowseLabel: string
    iconFormatsHint: string
    iconRemoveLabel: string
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
    orderMin: string
  }
}
