import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GroupMembers } from './GroupMembers'

const { addMutate, removeMutate, state } = vi.hoisted(() => ({
  addMutate: vi.fn(),
  removeMutate: vi.fn(),
  state: {
    members: [] as Array<{
      id: string
      firstName: string
      lastName: string
      email: string
      status: 'active' | 'inactive'
    }>,
    searchResults: [] as Array<{
      id: string
      firstName: string
      lastName: string
      email: string
      status: 'active' | 'inactive'
    }>,
  },
}))

vi.mock('../../api/members.queries', () => ({
  useGroupMembers: () => ({
    data: {
      items: state.members,
      total: state.members.length,
      page: 1,
      pages: 1,
      limit: 10,
    },
    isLoading: false,
  }),
  useUserSearch: () => ({ data: state.searchResults, isFetching: false }),
  useAddGroupMembers: () => ({ mutate: addMutate, isPending: false }),
  useRemoveGroupMember: () => ({ mutate: removeMutate }),
}))

vi.mock('@/shared/lib/notify', () => ({
  notify: { success: vi.fn(), queryError: vi.fn() },
}))

vi.mock('../../i18n', () => ({
  useUserGroupsTranslation: () => ({
    t: {
      members: {
        colMember: 'Member',
        colEmail: 'Email',
        colStatus: 'Status',
        colActions: 'Actions',
        removeMember: 'Remove from group',
        searchLabel: 'Add members',
        searchPlaceholder: 'Search users…',
        searchHint: 'Type to search',
        noSearchResults: 'No users found',
        addAction: 'Add',
        empty: 'This group has no members yet',
        totalCount: (n: number) => `${n} total`,
        toastAdded: 'Members updated',
        toastRemoved: 'Member removed',
      },
      status: { active: 'Active', inactive: 'Inactive' },
      table: { prevPage: 'Prev', nextPage: 'Next' },
    },
  }),
}))

const member = {
  id: 'u1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  status: 'active' as const,
}

describe('GroupMembers (Members tab UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.members = []
    state.searchResults = []
  })

  it('shows the empty state when the group has no members', () => {
    render(<GroupMembers groupId="g1" />)
    expect(
      screen.getByText('This group has no members yet')
    ).toBeInTheDocument()
  })

  it('renders the current members (name + email)', () => {
    state.members = [member]
    render(<GroupMembers groupId="g1" />)
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.getByText('1 total')).toBeInTheDocument()
  })

  it('removes a member when the remove action is clicked', async () => {
    state.members = [member]
    const user = userEvent.setup()
    render(<GroupMembers groupId="g1" />)
    await user.click(screen.getByRole('button', { name: 'Remove from group' }))
    expect(removeMutate).toHaveBeenCalledWith('u1', expect.any(Object))
  })

  it('shows search results and adds a user when "Add" is clicked', async () => {
    const candidate = {
      id: 'u2',
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      status: 'active' as const,
    }
    state.searchResults = [candidate]
    const user = userEvent.setup()
    render(<GroupMembers groupId="g1" />)

    // Typing reveals the debounced results panel (hasSearchTerm).
    await user.type(screen.getByLabelText('Add members'), 'grace')
    // Wait for the 300ms debounce to surface the candidate.
    expect(await screen.findByText('grace@example.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(addMutate).toHaveBeenCalledWith(['u2'], expect.any(Object))
  })
})
