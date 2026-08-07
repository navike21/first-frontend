import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterBar } from './FilterBar'

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const typeOptions = [
  { label: 'All', value: '' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Store', value: 'store' },
]

describe('FilterBar', () => {
  it('renders only the search field when no filters are given', () => {
    render(
      <FilterBar search={{ value: '', onChange: vi.fn(), label: 'Search' }} />
    )
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('renders only filters when no search is given', () => {
    render(
      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: statusOptions,
            value: '',
            onChange: vi.fn(),
          },
        ]}
      />
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('calls onChange with the typed value for search', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<FilterBar search={{ value: '', onChange, label: 'Search' }} />)
    await user.type(screen.getByLabelText('Search'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('renders multiple filters in order', () => {
    render(
      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: statusOptions,
            value: '',
            onChange: vi.fn(),
          },
          {
            id: 'type',
            label: 'Type',
            options: typeOptions,
            value: '',
            onChange: vi.fn(),
          },
        ]}
      />
    )
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('renders both search and filters together', () => {
    render(
      <FilterBar
        search={{ value: '', onChange: vi.fn(), label: 'Search' }}
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: statusOptions,
            value: '',
            onChange: vi.fn(),
          },
        ]}
      />
    )
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })
})
