export interface ProductTranslations {
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
    colSku: string
    colPrice: string
    colStatus: string
    colActions: string
    editProduct: string
    deleteProduct: string
    viewProduct: string
    restoreProduct: string
    purgeProduct: string
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
    statusDraft: string
    statusActive: string
    statusArchived: string
  }
  status: {
    draft: string
    active: string
    archived: string
  }
  actions: {
    newProduct: string
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
    sectionGeneral: string
    sectionContent: string
    sectionPricing: string
    sectionOrganization: string
    sectionSeo: string
    sectionImages: string
    sectionInventory: string
    name: string
    slug: string
    slugHint: string
    sku: string
    shortDescription: string
    description: string
    price: string
    compareAtPrice: string
    hasVariants: string
    variantOptions: string
    addVariantOption: string
    removeVariantOption: string
    variantOptionName: string
    variantOptionValues: string
    variantOptionValuesHint: string
    variants: string
    generateVariants: string
    variantSku: string
    variantPrice: string
    variantCompareAtPrice: string
    removeVariant: string
    noVariantsYet: string
    categoryIds: string
    tagIds: string
    status: string
    metaTitle: string
    metaDescription: string
    keywords: string
    ogImage: string
    gallery: string
    galleryUploadLabel: string
    galleryDragLabel: string
    galleryRemoveLabel: string
    galleryFormatsHint: string
    galleryMaxHint: string
    inventoryHint: string
    inventoryCreateFirst: string
    inventoryLocation: string
    inventoryQuantity: string
    inventorySave: string
    inventoryUpdated: string
    select: string
    save: string
    create: string
    cancel: string
    back: string
    next: string
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
  }
  validation: {
    required: string
    slugInvalid: string
    urlInvalid: string
    variantsRequired: string
  }
}
