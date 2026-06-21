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
    usersTitle: (name: string) => string
    usersDescription: string
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
    manageUsers: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
    permissionsCount: (n: number) => string
    systemBadge: string
    deletedAt: string
    selectAll: string
    selectRow: string
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
  tabs: {
    settings: string
    members: string
  }
  members: {
    searchLabel: string
    searchPlaceholder: string
    searchHint: string
    addAction: string
    noSearchResults: string
    colMember: string
    colEmail: string
    colStatus: string
    colActions: string
    removeMember: string
    empty: string
    totalCount: (count: number) => string
    toastAdded: string
    toastRemoved: string
    backLabel: string
    bulkRemove: string
    removeTitle: string
    removeDescription: (n: number) => string
    confirmRemove: string
    toastBulkRemoved: string
    selectedCount: (n: number) => string
    clearSelection: string
  }
  form: {
    name: string
    description: string
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
  /**
   * Localized labels for the permission catalog (`resource:action` keys from the
   * backend). Looked up with a fallback to the humanized key, so a new backend
   * resource/action shows its raw name until translated (never blank).
   */
  permissionCatalog: {
    /** Empty state when the catalog has no permissions. */
    noneAvailable: string
    /** Label for the `*` wildcard (resource and action) — full access. */
    allLabel: string
    /** Per-resource labels, keyed by the resource segment. */
    resources: Record<string, string>
    /** Per-action labels, keyed by the action segment. */
    actions: Record<string, string>
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
    purgeWarning: string
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
