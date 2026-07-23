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
  }) => <button aria-label={ariaLabel} disabled={disabled} onClick={onClick} />,
}))

vi.mock('../Checkbox', () => ({
  Checkbox: ({
    checked,
    indeterminate,
    onChange,
    'aria-label': ariaLabel,
  }: {
    checked?: boolean
    indeterminate?: boolean
    onChange?: (e: unknown) => void
    'aria-label'?: string
  }) => (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={!!checked}
      data-indeterminate={indeterminate ? 'true' : 'false'}
      onChange={() => onChange?.({})}
    />
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

const renderTable = (
  props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}
) =>
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
    // Assert — content is rendered twice (mobile card list + desktop table),
    // CSS (display:none) shows only the layout matching the viewport.
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0)
    expect(screen.getAllByText('#1').length).toBeGreaterThan(0)
  })

  it('should show the spinner while loading', () => {
    // Arrange & Act
    renderTable({ isLoading: true })
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
  })

  it('should show skeleton rows instead of stale data while isFetching', () => {
    // Arrange & Act — rows still holds the previous page's data (via
    // placeholderData), isFetching signals a background refetch in flight.
    renderTable({ isFetching: true })
    // Assert
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
    // Column headers stay visible so the shape of the table doesn't jump.
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should prioritize the initial-load spinner over the fetching skeleton', () => {
    // Arrange & Act
    renderTable({ isLoading: true, isFetching: true })
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should disable page controls while isFetching', () => {
    // Arrange & Act
    renderTable({
      isFetching: true,
      pagination: {
        page: 2,
        pages: 5,
        onPageChange: vi.fn(),
        prevLabel: 'prev',
        nextLabel: 'next',
      },
    })
    // Assert
    expect(screen.getByLabelText('prev')).toBeDisabled()
    expect(screen.getByLabelText('next')).toBeDisabled()
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

describe('DataTable row selection', () => {
  const selProps = {
    columns,
    rows,
    getRowKey: (r: Row) => r.id,
    emptyIcon: 'RiGroupLine' as const,
    emptyLabel: 'empty',
    selectable: true,
    selectAllLabel: 'all',
    selectRowLabel: 'row',
  }

  beforeEach(() => vi.clearAllMocks())

  it('renders no selection checkboxes when not selectable', () => {
    render(
      <DataTable {...selProps} selectable={false} onSelectionChange={vi.fn()} />
    )
    expect(screen.queryByLabelText('all')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('row')).not.toBeInTheDocument()
  })

  it('renders a header checkbox and one per row when selectable', () => {
    render(
      <DataTable {...selProps} selectedIds={[]} onSelectionChange={vi.fn()} />
    )
    expect(screen.getByLabelText('all')).toBeInTheDocument()
    // One per row in each layout (mobile card list + desktop table body).
    expect(screen.getAllByLabelText('row')).toHaveLength(rows.length * 2)
  })

  it('selecting a row reports it via onSelectionChange', async () => {
    const user = userEvent.setup()
    const onSel = vi.fn()
    render(
      <DataTable {...selProps} selectedIds={[]} onSelectionChange={onSel} />
    )
    await user.click(screen.getAllByLabelText('row')[0])
    expect(onSel).toHaveBeenCalledWith(['1'])
  })

  it('deselecting an already-selected row removes it', async () => {
    const user = userEvent.setup()
    const onSel = vi.fn()
    render(
      <DataTable {...selProps} selectedIds={['1']} onSelectionChange={onSel} />
    )
    await user.click(screen.getAllByLabelText('row')[0])
    expect(onSel).toHaveBeenCalledWith([])
  })

  it('header selects all current rows when none are selected', async () => {
    const user = userEvent.setup()
    const onSel = vi.fn()
    render(
      <DataTable {...selProps} selectedIds={[]} onSelectionChange={onSel} />
    )
    await user.click(screen.getByLabelText('all'))
    expect(onSel).toHaveBeenCalledWith(['1', '2'])
  })

  it('header deselects all when all are selected', async () => {
    const user = userEvent.setup()
    const onSel = vi.fn()
    render(
      <DataTable
        {...selProps}
        selectedIds={['1', '2']}
        onSelectionChange={onSel}
      />
    )
    await user.click(screen.getByLabelText('all'))
    expect(onSel).toHaveBeenCalledWith([])
  })

  it('header is indeterminate when only some rows are selected', () => {
    render(
      <DataTable
        {...selProps}
        selectedIds={['1']}
        onSelectionChange={vi.fn()}
      />
    )
    expect(screen.getByLabelText('all')).toHaveAttribute(
      'data-indeterminate',
      'true'
    )
  })
})
