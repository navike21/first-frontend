import { render, renderHook, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateUserForm } from './CreateUserForm'
import { useCreateUserForm } from './CreateUserForm.hooks'

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

describe('User form — authentication section', () => {
  beforeEach(() => vi.clearAllMocks())

  const fill = async (
    container: HTMLElement,
    user: ReturnType<typeof userEvent.setup>,
    password: string,
    confirmPassword: string
  ) => {
    const byName = (name: string) =>
      container.querySelector<HTMLInputElement>(`input[name="${name}"]`)!
    await user.type(byName('firstName'), 'Ana')
    await user.type(byName('lastName'), 'Lopez')
    await user.type(byName('email'), 'ana@test.com')
    await user.type(byName('password'), password)
    await user.type(byName('confirmPassword'), confirmPassword)
  }

  it('does not submit when password and confirmation do not match', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    const { container } = render(
      <CreateUserForm {...props} onCreate={onCreate} />
    )
    await fill(container, user, 'Password1', 'Password2')
    await user.click(container.querySelector('button[type="submit"]')!)
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('submits without confirmPassword in the payload when valid', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    const { container } = render(
      <CreateUserForm {...props} onCreate={onCreate} />
    )
    await fill(container, user, 'Password1', 'Password1')
    await user.click(container.querySelector('button[type="submit"]')!)
    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1))
    const payload = onCreate.mock.calls[0][0] as Record<string, unknown>
    expect(payload).not.toHaveProperty('confirmPassword')
    expect(payload.password).toBe('Password1')
    expect(payload.email).toBe('ana@test.com')
  })
})
