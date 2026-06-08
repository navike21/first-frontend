import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNetworkStore } from '@/shared/model'
import { NetworkStatusBanner } from './NetworkStatusBanner'

describe('NetworkStatusBanner', () => {
  beforeEach(() => {
    useNetworkStore.setState({ isOnline: true })
  })

  it('should be visually hidden (translated off-screen) when online', () => {
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    expect(banner).toHaveClass('-translate-y-full')
    expect(banner).not.toHaveClass('translate-y-0')
  })

  it('should be visible when offline', () => {
    useNetworkStore.setState({ isOnline: false })
    render(<NetworkStatusBanner />)
    const banner = screen.getByRole('status')
    expect(banner).toHaveClass('translate-y-0')
    expect(banner).not.toHaveClass('-translate-y-full')
  })

  it('should render the offline message when offline', () => {
    useNetworkStore.setState({ isOnline: false })
    render(<NetworkStatusBanner />)
    expect(screen.getByText(/sin conexión/i)).toBeInTheDocument()
  })

  it('should have aria-live polite for screen readers', () => {
    render(<NetworkStatusBanner />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('should not have aria-label when online', () => {
    render(<NetworkStatusBanner />)
    expect(screen.getByRole('status')).not.toHaveAttribute('aria-label')
  })

  it('should have aria-label describing offline state when offline', () => {
    useNetworkStore.setState({ isOnline: false })
    render(<NetworkStatusBanner />)
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Sin conexión a internet'
    )
  })
})
