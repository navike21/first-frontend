import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SettingsDrawer } from './SettingsDrawer'

vi.mock('@/shared/ui', () => ({
  Drawer: ({
    isOpen,
    onClose,
    children,
    title,
  }: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: React.ReactNode
  }) =>
    isOpen ? (
      <dialog open>
        {title}
        <button onClick={onClose} aria-label="close-drawer">
          Close
        </button>
        {children}
      </dialog>
    ) : null,
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}))

describe('SettingsDrawer component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render nothing when isOpen is false', () => {
    render(<SettingsDrawer isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render drawer when isOpen is true', () => {
    render(<SettingsDrawer isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should render the title', () => {
    render(<SettingsDrawer isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText('Configuración')).toBeInTheDocument()
  })

  it('should render the language switcher', () => {
    render(<SettingsDrawer isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<SettingsDrawer isOpen={true} onClose={onClose} />)
    await user.click(screen.getByLabelText('close-drawer'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
