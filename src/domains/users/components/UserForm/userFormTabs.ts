export type UserFormTab = 'personal' | 'account'

/**
 * Field names that live in the "Personal details" tab. Used to decide which tab
 * to reveal when a submit fails validation (so the user always sees the error).
 * Anything not listed (password, confirmPassword, groupIds) is in the "Account"
 * tab.
 */
export const USER_FORM_PERSONAL_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'gender',
  'dateOfBirth',
  'address',
] as const

/** Picks the tab that contains the first validation error. */
export const tabForErrors = (errors: Record<string, unknown>): UserFormTab =>
  USER_FORM_PERSONAL_FIELDS.some((f) => f in errors) ? 'personal' : 'account'
