import type { SeoCheckId } from '../model/page.seo'

export interface PageTranslations {
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
    builderTitle: string
    builderDescription: (name: string) => string
    builderComingSoon: string
    builderComingSoonHint: string
  }
  table: {
    noResults: string
    colTitle: string
    colStatus: string
    colCategories: string
    colTags: string
    colActions: string
    editItem: string
    deleteItem: string
    viewItem: string
    buildItem: string
    moreActions: string
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
    purgeBlockedByChildren: string
  }
  form: {
    sectionGeneral: string
    sectionSeo: string
    sectionOrganization: string
    sectionCover: string
    tabTranslations: string
    title: string
    slug: string
    slugHint: string
    fullPathPreview: string
    parent: string
    noParent: string
    description: string
    metaTitle: string
    metaDescription: string
    keywords: string
    keywordsHint: string
    ogImage: string
    ogImageUploadLabel: string
    ogImageRemoveLabel: string
    categoryIds: string
    tagIds: string
    status: string
    scheduledAt: string
    cover: string
    coverUploadLabel: string
    coverDragLabel: string
    coverDragOrLabel: string
    coverBrowseLabel: string
    coverFormatsHint: string
    coverRemoveLabel: string
    select: string
    save: string
    create: string
    cancel: string
    back: string
    next: string
    optional: string
    createdBy: string
    updatedBy: string
    unknownUser: string
  }
  revisions: {
    title: string
    empty: string
    restoredAt: (date: string) => string
    by: (name: string) => string
    restore: string
    preview: string
    previewTitle: (date: string) => string
    compareCurrent: string
    compareRevision: string
    noChanges: string
    changesCount: (count: number) => string
    fieldSections: string
    sectionsCount: (count: number) => string
    restoreTitle: string
    restoreDescription: (date: string) => string
    confirmRestore: string
    cancel: string
    restored: string
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
    scheduledAtRequired: string
  }
  builder: {
    palette: string
    paletteColumns: string
    paletteHint: string
    empty: string
    chooseColumns: string
    columnsLabel: string
    addText: string
    addImage: string
    textElement: string
    imageElement: string
    imageSelect: string
    imageReplace: string
    imageAlt: string
    deleteSection: string
    deleteSectionConfirm: string
    deleteElement: string
    dragSection: string
    dragElement: string
    unknownSection: (type: string) => string
    edit: string
    done: string
    textEmpty: string
    dropHere: string
    widthLabel: string
    heightLabel: string
    sizeHint: string
    alignLabel: string
    alignLeft: string
    alignCenter: string
    alignRight: string
    save: string
    saved: string
    unsaved: string
    uploadError: string
    cancel: string
    confirmDelete: string
  }
  seo: {
    action: string
    colSeo: string
    drawerTitle: string
    summary: (good: number, warnings: number, problems: number) => string
    groupProblems: string
    groupImprovements: string
    groupGood: string
    focusKeyword: string
    noKeyword: string
    charsCount: (count: number, min: number, max: number) => string
    previewsTitle: string
    previewGoogle: string
    previewFacebook: string
    previewLinkedIn: string
    previewX: string
    noImage: string
    imageSize: (width: number, height: number) => string
    imageSizeHint: string
    checks: Record<SeoCheckId, string>
  }
}
