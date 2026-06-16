import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { DataTable } from './DataTable'
import type { DataTableColumn } from './DataTable.types'

vi.mock('../../atoms/Spinner', () => ({
  Spinner: () => <span data-testid="spinner" />,
}))

vi.mock('../../atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}))

vi.mock('../../atoms/IconButton', () => ({
  IconButton: ({
    'aria-label': ariaLabel,
    disabled,
    onClick,
  }: {
    'aria-label': string
    disabled?: boolean
    onClick?: () => void
  }) => (
    <button aria-label={ariaLabel} disabled={disabled} onClick={onClick} />
  ),
}))

interface Row {
  id: string
  name: string
}

const rows: Row[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
]

const columns: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name },
  { id: 'actions', header: 'Actions', align: 'right', cell: (r) => `#${r.id}` },
]

const renderTable = (props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) =>
  render(
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(r) => r.id}
      emptyIcon="RiGroupLine"
      emptyLabel="Nothing here"
      {...props}
    />
  )

describe('DataTable component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render column headers', () => {
    // Arrange & Act
    renderTable()
    // Assert
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should render a cell per row using the column renderer', () => {
    // Arrange & Act
    renderTable()
    // Assert
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('should show the spinner while loading', () => {
    // Arrange & Act
    renderTable({ isLoading: true })
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('should show the empty state when there are no rows', () => {
    // Arrange & Act
    renderTable({ rows: [] })
    // Assert
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.getByTestId('icon-RiGroupLine')).toBeInTheDocument()
  })

  it('should render the total label when provided', () => {
    // Arrange & Act
    renderTable({ totalLabel: '2 items' })
    // Assert
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('should not render page controls without pagination (all-records mode)', () => {
    // Arrange & Act
    renderTable({ totalLabel: '2 items' })
    // Assert
    expect(screen.queryByLabelText('prev')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('next')).not.toBeInTheDocument()
  })

  it('should hide page controls when there is a single page', () => {
    // Arrange & Act
    renderTable({
      pagination: {
        page: 1,
        pages: 1,
        onPageChange: vi.fn(),
        prevLabel: 'prev',
        nextLabel: 'next',
      },
    })
    // Assert
    expect(screen.queryByLabelText('prev')).not.toBeInTheDocument()
  })

  it('should render page controls and the page indicator when there are multiple pages', () => {
    // Arrange & Act
    renderTable({
      pagination: {
        page: 2,
        pages: 5,
        onPageChange: vi.fn(),
        prevLabel: 'prev',
        nextLabel: 'next',
      },
    })
    // Assert
    expect(screen.getByLabelText('prev')).toBeInTheDocument()
    expect(screen.getByLabelText('next')).toBeInTheDocument()
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('should call onPageChange with the next page', async () => {
    // Arrange
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    renderTable({
      pagination: {
        page: 2,
        pages: 5,
        onPageChange,
        prevLabel: 'prev',
        nextLabel: 'next',
      },
    })
    // Act
    await user.click(screen.getByLabelText('next'))
    // Assert
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should disable prev on the first page and next on the last page', () => {
    // Arrange & Act
    const { rerender } = renderTable({
      pagination: {
        page: 1,
        pages: 3,
        onPageChange: vi.fn(),
        prevLabel: 'prev',
        nextLabel: 'next',
      },
    })
    // Assert — first page
    expect(screen.getByLabelText('prev')).toBeDisabled()
    expect(screen.getByLabelText('next')).not.toBeDisabled()

    // Act — last page
    rerender(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        emptyIcon="RiGroupLine"
        emptyLabel="Nothing here"
        pagination={{
          page: 3,
          pages: 3,
          onPageChange: vi.fn(),
          prevLabel: 'prev',
          nextLabel: 'next',
        }}
      />
    )
    // Assert — last page
    expect(screen.getByLabelText('prev')).not.toBeDisabled()
    expect(screen.getByLabelText('next')).toBeDisabled()
  })
})
