import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReactQueryProvider } from './ReactQueryProvider'
import { useQuery } from '@tanstack/react-query'

describe('ReactQueryProvider', () => {
  const MockComponent = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['data'],
      queryFn: async () => 'fetched data',
    })

    if (isLoading) return <div>Loading...</div>
    return <div>{data}</div>
  }

  it('should render children correctly', () => {
    render(
      <ReactQueryProvider>
        <div>Test Child</div>
      </ReactQueryProvider>
    )

    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('should render loading state correctly', () => {
    render(
      <ReactQueryProvider>
        <MockComponent />
      </ReactQueryProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  it('should render fetched data correctly', async () => {
    render(
      <ReactQueryProvider>
        <MockComponent />
      </ReactQueryProvider>
    )

    await waitFor(() => screen.getByText('fetched data'))
    expect(screen.getByText('fetched data')).toBeInTheDocument()
  })
})
