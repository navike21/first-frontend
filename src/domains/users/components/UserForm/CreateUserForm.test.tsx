import { render, renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateUserForm } from './CreateUserForm'
import { useCreateUserForm } from './CreateUserForm.hooks'
import { createCreateUserFormSchema } from '../../model/user.schema'

// Provide active groups without hitting the network.
vi.mock('../../model/userConfig.store', () => ({
  useUserConfigStore: () => ({
    genders: ['female', 'male', 'other', 'prefer_not_to_say'],
    presenceStatuses: [],
    userStatuses: [],
    userGroups: [
      { id: 'g1', name: 'Admins', status: 'active', color: '#111' },
      { id: 'g2', name: 'Editors', status: 'active', color: '#222' },
      { id: 'g3', name: 'Archived', status: 'inactive', color: '#333' },
    ],
    isLoaded: true,
    load: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('./usePhotoUpload', () => ({
  usePhotoUpload: () => ({ pendingFile: null, setPendingFile: vi.fn() }),
}))

vi.mock('@/shared/api/geo', () => ({
  useCountries: () => ({ data: [], isLoading: false }),
  useDivisions: () => ({ data: null, isFetching: false }),
}))

const props = {
  isSubmitting: false,
  onCancel: vi.fn(),
  onCreate: vi.fn(),
  submitError: undefined,
}

describe('User form — multi-group selector', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the groups field as a MULTI-select with the active groups', () => {
    const { container } = render(<CreateUserForm {...props} />)
    // The groups <select> is the only multiple one (gender is single-select).
    const multiSelects = container.querySelectorAll('select[multiple]')
    expect(multiSelects).toHaveLength(1)
    // Active groups are offered as options; the inactive one is excluded.
    const optionLabels = Array.from(
      multiSelects[0].querySelectorAll('option')
    ).map((o) => o.textContent)
    expect(optionLabels).toEqual(['Admins', 'Editors'])
  })

  it('maps only active groups into options', () => {
    const { result } = renderHook(() => useCreateUserForm(props))
    expect(result.current.groupOptions).toEqual([
      { value: 'g1', label: 'Admins' },
      { value: 'g2', label: 'Editors' },
    ])
  })

  it('selecting several groups feeds an array into groupIds', () => {
    const { result } = renderHook(() => useCreateUserForm(props))
    act(() => result.current.onGroupsChange(['g1', 'g2']))
    expect(result.current.groupIdsValue).toEqual(['g1', 'g2'])
  })
})

// Validation-message stub (only the strings the form schema references).
const v = {
  emailInvalid: 'email',
  passwordMin: 'min',
  passwordUppercase: 'upper',
  passwordNumber: 'number',
  passwordMismatch: 'mismatch',
  required: 'required',
  fieldMin2: 'min2',
  dateFormat: 'date',
  urlInvalid: 'url',
}

const validUser = {
  email: 'ana@test.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  firstName: 'Ana',
  lastName: 'Lopez',
  gender: 'other' as const,
  address: { country: 'PE', region: 'Lima', address: 'Av. Principal' },
}

describe('User form — authentication / required validation', () => {
  it('rejects when password and confirmation do not match', () => {
    const schema = createCreateUserFormSchema(v)
    const result = schema.safeParse({ ...validUser, confirmPassword: 'Other1' })
    expect(result.success).toBe(false)
  })

  it('accepts a fully valid form (passwords match, required fields present)', () => {
    const schema = createCreateUserFormSchema(v)
    expect(schema.safeParse(validUser).success).toBe(true)
  })

  it('requires gender (address is optional)', () => {
    const schema = createCreateUserFormSchema(v)
    const { gender: _g, ...withoutGender } = validUser
    expect(schema.safeParse(withoutGender).success).toBe(false)
    // Address is optional: omitting it does not cause validation failure.
    const { address: _a, ...withoutAddress } = validUser
    expect(schema.safeParse(withoutAddress).success).toBe(true)
  })
})
