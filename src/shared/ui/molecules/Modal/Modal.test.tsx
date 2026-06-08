import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom')
  return { ...actual, createPortal: (node: React.ReactNode) => node }
})

vi.mock('@/shared/ui', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
}))

describe('Modal component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.body.style.overflow = ''
  })

  it('should render children when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('should render title when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="My Modal">
        Content
      </Modal>,
    )
    expect(screen.getByText('My Modal')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Title" description="Some description">
        Content
      </Modal>,
    )
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('should render footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} footer={<button>Confirm</button>}>
        Content
      </Modal>,
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should render close button by default', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Title">
        Content
      </Modal>,
    )
    expect(screen.getByLabelText('Cerrar')).toBeInTheDocument()
  })

  it('should not render close button when showCloseButton=false', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false} title="Title">
        Content
      </Modal>,
    )
    expect(screen.queryByLabelText('Cerrar')).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Title">
        Content
      </Modal>,
    )
    await user.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    )
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when backdrop is clicked and closeOnBackdrop=false', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdrop={false}>
        Content
      </Modal>,
    )
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should call onClose when Escape key is pressed while open', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when Escape key is pressed while closed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal isOpen={false} onClose={onClose}>
        Content
      </Modal>,
    )
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should not call onClose when a non-Escape key is pressed while open', async () => {
    // Covers the false branch of `if (e.key === 'Escape')` at line 28
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    )
    await user.keyboard('{Enter}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should apply pointer-events-none when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    const wrapper = container.querySelector('[role="dialog"]')
    expect(wrapper).toHaveClass('pointer-events-none')
  })

  it('should lock body scroll when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should apply scale-100 opacity-100 when open', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    const panel = container.querySelector('[role="dialog"] > div')
    expect(panel).toHaveClass('scale-100', 'opacity-100')
  })

  it('should apply scale-95 opacity-0 when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>,
    )
    const panel = container.querySelector('[role="dialog"] > div')
    expect(panel).toHaveClass('scale-95', 'opacity-0')
  })
})
