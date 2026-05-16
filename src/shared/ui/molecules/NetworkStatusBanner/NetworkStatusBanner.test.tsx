import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { useNetworkStoreMock } = vi.hoisted(() => ({
  useNetworkStoreMock: vi.fn(),
}))

vi.mock('@/shared/model', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/model')>()
  return {
    ...actual,
    useNetworkStore: useNetworkStoreMock,
  }
})

import { NetworkStatusBanner } from './NetworkStatusBanner'

describe('NetworkStatusBanner', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should be visually hidden (translated off-screen) when online', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(true)
    // Act
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    // Assert — -translate-y-full moves it above the viewport
    expect(banner).toHaveClass('-translate-y-full')
    expect(banner).not.toHaveClass('translate-y-0')
  })

  it('should be visible when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    // Assert
    expect(banner).toHaveClass('translate-y-0')
    expect(banner).not.toHaveClass('-translate-y-full')
  })

  it('should render the offline message when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByText(/sin conexión/i)).toBeInTheDocument()
  })

  it('should have aria-live polite for screen readers', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('should not have aria-label when online', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(true)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-label')
  })

  it('should have aria-label describing offline state when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Sin conexión a internet'
    )
  })
})

describe('NetworkStatusBanner', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should be visually hidden (translated off-screen) when online', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(true)
    // Act
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    // Assert — -translate-y-full moves it above the viewport
    expect(banner).toHaveClass('-translate-y-full')
    expect(banner).not.toHaveClass('translate-y-0')
  })

  it('should be visible when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    // Assert
    expect(banner).toHaveClass('translate-y-0')
    expect(banner).not.toHaveClass('-translate-y-full')
  })

  it('should render the offline message when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByText(/sin conexión/i)).toBeInTheDocument()
  })

  it('should have aria-live polite for screen readers', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('should not have aria-label when online', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(true)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-label')
  })

  it('should have aria-label describing offline state when offline', () => {
    // Arrange
    useNetworkStoreMock.mockReturnValue(false)
    // Act
    render(<NetworkStatusBanner />)
    // Assert
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Sin conexión a internet'
    )
  })
})
