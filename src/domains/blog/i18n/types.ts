export interface BlogTranslations {
  page: {
    listTitle: string
    listDescription: string
    createTitle: string
    createDescription: string
    editTitle: string
    editDescription: (title: string) => string
    trashTitle: string
    trashDescription: string
    trashEmpty: string
    trashEmptyDescription: string
  }
  table: {
    noResults: string
    colTitle: string
    colStatus: string
    colCategories: string
    colTags: string
    colAuthor: string
    colDate: string
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
    scheduledFor: (date: string) => string
  }
  filters: {
    searchLabel: string
    searchPlaceholder: string
    statusLabel: string
    statusAll: string
  }
  status: {
    draft: string
    scheduled: string
    published: string
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
    deleteDescription: (title: string) => string
    confirmDelete: string
    bulkDeleteDescription: (count: number) => string
    restoreTitle: string
    restoreDescription: (title: string) => string
    confirmRestore: string
    bulkRestoreDescription: (count: number) => string
    purgeTitle: string
    purgeDescription: (title: string) => string
    confirmPurge: string
    bulkPurgeDescription: (count: number) => string
  }
  form: {
    sectionGeneral: string
    sectionContent: string
    sectionOrganization: string
    sectionSeo: string
    sectionPublication: string
    tabTranslations: string
    title: string
    slug: string
    slugHint: string
    excerpt: string
    content: string
    categoryIds: string
    tagIds: string
    authorId: string
    authorNoOptions: string
    metaTitle: string
    metaDescription: string
    keywords: string
    keywordsHint: string
    ogImage: string
    ogImageUploadLabel: string
    ogImageRemoveLabel: string
    status: string
    scheduledAt: string
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
    suggestTranslation: string
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
    addSelectedLabel: string
    selectAllLabel: string
    selectItemLabel: string
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
    translationApplied: string
  }
  validation: {
    required: string
    slugInvalid: string
    urlInvalid: string
    scheduledAtRequired: string
  }
}
