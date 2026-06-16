import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RootLayout } from './RootLayout'

vi.mock('@/shared/lib', () => ({
  useSessionSync: vi.fn(),
  useNetworkStatus: vi.fn(),
}))

vi.mock('@/shared/ui/molecules/NetworkStatusBanner', () => ({
  NetworkStatusBanner: () => null,
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">outlet content</div>,
  }
})

describe('RootLayout component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the Outlet', () => {
    // Arrange & Act
    render(<RootLayout />)
    // Assert
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('should call useSessionSync on mount', async () => {
    // Arrange
    const { useSessionSync } = await import('@/shared/lib')
    // Act
    render(<RootLayout />)
    // Assert
    expect(useSessionSync).toHaveBeenCalled()
  })

  it('should call useNetworkStatus on mount', async () => {
    // Arrange
    const { useNetworkStatus } = await import('@/shared/lib')
    // Act
    render(<RootLayout />)
    // Assert
    expect(useNetworkStatus).toHaveBeenCalled()
  })
})
