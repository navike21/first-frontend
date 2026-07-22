import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ServerErrorPage } from './ServerErrorPage'

vi.mock('@/shared/ui', () => ({
  BrandMark: () => <span>First</span>,
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

describe('ServerErrorPage component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the 500 status code', () => {
    render(<ServerErrorPage />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('should render the server error heading', () => {
    render(<ServerErrorPage />)
    expect(
      screen.getByRole('heading', { name: /error del servidor/i })
    ).toBeInTheDocument()
  })

  it('should render the descriptive message', () => {
    render(<ServerErrorPage />)
    expect(
      screen.getByText(/ocurrió un error inesperado en el servidor/i)
    ).toBeInTheDocument()
  })

  it('should render the First wordmark', () => {
    render(<ServerErrorPage />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should reload the page when the retry button is clicked', async () => {
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    })
    const user = userEvent.setup()
    render(<ServerErrorPage />)
    await user.click(screen.getByRole('button', { name: /reintentar/i }))
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })
})
