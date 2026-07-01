export interface ClientsTranslations {
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
    colBusinessName: string
    colType: string
    colCountry: string
    colIndustry: string
    colStatus: string
    colActions: string
    editClient: string
    deleteClient: string
    viewClient: string
    restoreClient: string
    purgeClient: string
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
  clientType: {
    person: string
    company: string
  }
  status: {
    active: string
    inactive: string
    deleted: string
  }
  actions: {
    newClient: string
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
    sectionContact: string
    sectionLocation: string
    sectionOther: string
    businessName: string
    clientType: string
    documentType: string
    documentNumber: string
    country: string
    countryHint: string
    region: string
    province: string
    district: string
    address: string
    logo: string
    uploadLogo: string
    logoHint: string
    website: string
    email: string
    phone: string
    industry: string
    language: string
    currency: string
    currencyHint: string
    status: string
    contactFirstName: string
    contactLastName: string
    contactEmail: string
    contactPhone: string
    contactPosition: string
    notes: string
    documentTypeNone: string
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
    businessNameMin: string
    businessNameMax: string
    countryLength: string
    currencyLength: string
    documentNumberMax: string
    notesMax: string
    emailInvalid: string
    urlInvalid: string
    contactNameMin: string
    contactEmailInvalid: string
  }
}
