import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FadeCollapse } from './FadeCollapse'

describe('FadeCollapse', () => {
  it('should not render children when show is false', () => {
    render(<FadeCollapse show={false}><div>Test Content</div></FadeCollapse>)
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('should render children when show is true', () => {
    render(<FadeCollapse show={true}><div>Test Content</div></FadeCollapse>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
})
