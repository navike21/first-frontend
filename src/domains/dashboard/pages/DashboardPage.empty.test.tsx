import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore } from '@/shared/model'

// No mock of dashboard.constants — real RECENT_ACTIVITY is an empty array
import { DashboardPage } from './DashboardPage'

describe('DashboardPage empty activity state', () => {
  beforeEach(() => {
    useSessionStore.setState({ isAuthenticated: false, token: null, user: null })
  })

  it('renders no-recent-activity message when RECENT_ACTIVITY is empty', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/no hay actividad reciente/i)).toBeInTheDocument()
  })
})
