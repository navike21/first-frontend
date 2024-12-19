import { describe, it, vi, expect, Mock } from 'vitest'
import { render } from '@testing-library/react'
import { PublicPagesProvider } from './PublicPagesProvider'
import { useAuth } from '@Hooks/useAuth'
import { useNavigate } from 'react-router'

vi.mock('@Hooks/useAuth')
vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}))

describe('PublicPagesProvider', () => {
  it('renders children when user is not logged in and has no token', () => {
    ;(useAuth as Mock).mockReturnValue({ token: null, isLogged: false })
    const navigate = vi.fn()
    ;(useNavigate as Mock).mockReturnValue(navigate)

    const { getByText } = render(
      <PublicPagesProvider>
        <div>Public Page</div>
      </PublicPagesProvider>
    )

    expect(getByText('Public Page')).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('redirects to "/" when user is logged in and has a token', () => {
    ;(useAuth as Mock).mockReturnValue({
      token: 'valid-token',
      isLogged: true,
    })
    const navigate = vi.fn()
    ;(useNavigate as Mock).mockReturnValue(navigate)

    render(
      <PublicPagesProvider>
        <div>Public Page</div>
      </PublicPagesProvider>
    )

    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('does not render children when user is logged in and has a token', () => {
    ;(useAuth as Mock).mockReturnValue({
      token: 'valid-token',
      isLogged: true,
    })
    const navigate = vi.fn()
    ;(useNavigate as Mock).mockReturnValue(navigate)

    const { queryByText } = render(
      <PublicPagesProvider>
        <div>Public Page</div>
      </PublicPagesProvider>
    )

    expect(queryByText('Public Page')).not.toBeInTheDocument()
  })
})
