import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Footer } from './Footer'

describe('Footer component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the footer element', () => {
    // Arrange & Act
    render(<Footer />)
    // Assert
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should display the current year in the copyright notice', () => {
    // Arrange
    const year = new Date().getFullYear().toString()
    // Act
    render(<Footer />)
    // Assert
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('should display Indra in the copyright text', () => {
    // Arrange & Act
    render(<Footer />)
    // Assert
    expect(screen.getByText(/Indra/)).toBeInTheDocument()
  })

  it('should render the "Términos de uso" link', () => {
    // Arrange & Act
    render(<Footer />)
    // Assert
    expect(screen.getByText('Términos de uso')).toBeInTheDocument()
  })

  it('should render the "Privacidad" link', () => {
    // Arrange & Act
    render(<Footer />)
    // Assert
    expect(screen.getByText('Privacidad')).toBeInTheDocument()
  })
})
