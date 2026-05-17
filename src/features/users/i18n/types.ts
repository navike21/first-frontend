export interface UsersTranslations {
  page: {
    listTitle: string
    listDescription: string
    createTitle: string
    createDescription: string
    editTitle: string
    editDescription: (name: string) => string
  }
  table: {
    noResults: string
    colUser: string
    colEmail: string
    colStatus: string
    colPresence: string
    colActions: string
    editUser: string
    deleteUser: string
    prevPage: string
    nextPage: string
    totalCount: (count: number) => string
  }
  status: {
    active: string
    inactive: string
    deleted: string
  }
  presence: {
    available: string
    busy: string
    away: string
    offline: string
  }
  form: {
    firstName: string
    firstNamePlaceholder: string
    lastName: string
    lastNamePlaceholder: string
    email: string
    emailPlaceholder: string
    password: string
    passwordPlaceholder: string
    phone: string
    phonePlaceholder: string
    gender: string
    genderPlaceholder: string
    genderFemale: string
    genderMale: string
    genderOther: string
    genderPreferNotToSay: string
    statusLabel: string
    statusActive: string
    statusInactive: string
    createButton: string
    saveButton: string
    cancelButton: string
  }
  actions: {
    newUser: string
    deactivateTitle: string
    deactivateDescription: (firstName: string, lastName: string) => string
    confirmDeactivate: string
    cancel: string
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
    deactivated: string
  }
}
