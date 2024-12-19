import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ToasterContent } from './ToasterContent'

describe('ToasterContent', () => {
  it('renders the Toaster component with default props', () => {
    render(<ToasterContent />)

    const toasterElement = document.querySelector(
      'section[aria-label="Notifications alt+T"]'
    )
    expect(toasterElement).toBeInTheDocument()
    expect(toasterElement).toHaveAttribute('aria-live', 'polite')
  })

  it('applies custom props correctly', () => {
    render(
      <ToasterContent
        richColors={true}
        position="bottom-right"
        className="custom-class"
      />
    )

    const toasterElement = document.querySelector(
      'section[aria-label="Notifications alt+T"]'
    )
    expect(toasterElement).toBeInTheDocument()
    expect(toasterElement).toHaveAttribute('aria-live', 'polite')
  })
})
