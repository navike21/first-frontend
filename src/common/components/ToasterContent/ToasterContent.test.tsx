import { render } from '@testing-library/react'
import { ToasterContent } from './ToasterContent'
import { describe, it, expect } from 'vitest'
import { Toaster } from 'sonner'

vi.mock('sonner', () => ({
  Toaster: vi.fn(() => null),
}))

describe('ToasterContent', () => {
  it('should render Toaster with default props', () => {
    render(<ToasterContent />)

    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        richColors: true,
        position: 'top-center',
      }),
      {}
    )
  })

  it('should override default props when provided', () => {
    render(<ToasterContent richColors={false} position="bottom-right" />)

    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        richColors: false,
        position: 'bottom-right',
      }),
      {}
    )
  })

  it('should pass additional props to Toaster', () => {
    render(<ToasterContent duration={3000} />)

    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 3000,
        richColors: true,
        position: 'top-center',
      }),
      {}
    )
  })
})
