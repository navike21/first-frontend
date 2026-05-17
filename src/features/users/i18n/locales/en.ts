import type { UsersTranslations } from '../types'

export const en: UsersTranslations = {
  page: {
    listTitle: 'Users',
    listDescription: 'Manage system users',
    createTitle: 'New user',
    createDescription: 'Fill in the fields to register a new user in the system',
    editTitle: 'Edit user',
    editDescription: (name) => `Edit ${name}'s details`,
  },
  table: {
    noResults: 'No users found',
    colUser: 'User', colEmail: 'Email', colStatus: 'Status',
    colPresence: 'Presence', colActions: 'Actions',
    editUser: 'Edit user', deleteUser: 'Delete user',
    prevPage: 'Previous page', nextPage: 'Next page',
    totalCount: (n) => `${n} user${n !== 1 ? 's' : ''} total`,
  },
  status: { active: 'Active', inactive: 'Inactive', deleted: 'Deleted' },
  presence: { available: 'Available', busy: 'Busy', away: 'Away', offline: 'Offline' },
  form: {
    firstName: 'First name', firstNamePlaceholder: 'John',
    lastName: 'Last name', lastNamePlaceholder: 'Smith',
    email: 'Email', emailPlaceholder: 'user@navike21.com',
    password: 'Password', passwordPlaceholder: 'Minimum 8 characters',
    phone: 'Phone', phonePlaceholder: '+1 999 999 9999',
    gender: 'Gender', genderPlaceholder: 'Select',
    genderFemale: 'Female', genderMale: 'Male',
    genderOther: 'Other', genderPreferNotToSay: 'Prefer not to say',
    statusLabel: 'Status', statusActive: 'Active', statusInactive: 'Inactive',
    createButton: 'Create user', saveButton: 'Save changes', cancelButton: 'Cancel',
  },
  actions: {
    newUser: 'New user',
    deactivateTitle: 'Deactivate user',
    deactivateDescription: (first, last) =>
      `Are you sure you want to deactivate ${first} ${last}? The user will lose access to the system.`,
    confirmDeactivate: 'Deactivate',
    cancel: 'Cancel',
  },
  filters: {
    searchLabel: 'Search', searchPlaceholder: 'Name, surname or email…',
    statusLabel: 'Status', statusAll: 'All statuses',
    statusActive: 'Active', statusInactive: 'Inactive',
  },
  toasts: {
    created: 'User created successfully',
    updated: 'User updated successfully',
    deactivated: 'User deactivated successfully',
  },
  validation: {
    emailInvalid: 'Invalid email',
    passwordMin: 'Minimum 8 characters',
    passwordUppercase: 'Must contain at least one uppercase letter',
    passwordNumber: 'Must contain at least one number',
    fieldMin2: 'Minimum 2 characters',
    dateFormat: 'Format YYYY-MM-DD',
    urlInvalid: 'Invalid URL',
  },
}
