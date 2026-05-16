import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SelectFooter } from './SelectFooter'

vi.mock('@Components/atoms/HelperText/HelperText', () => ({
  HelperText: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <div role={variant === 'error' ? 'alert' : undefined}>{children}</div>
  ),
}))

describe('SelectFooter', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('errorMessage', () => {
    it('should render errorMessage as alert when variant is error', () => {
      // Arrange & Act
      render(<SelectFooter idField="field" variant="error" errorMessage="This field is required" />)

      // Assert
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
    })

    it('should not render errorMessage when variant is not error', () => {
      // Arrange & Act
      render(
        <SelectFooter idField="field" variant="default" errorMessage="This field is required" />,
      )

      // Assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('should not render anything when errorMessage is undefined and variant is error', () => {
      // Arrange & Act
      render(<SelectFooter idField="field" variant="error" />)

      // Assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('helperText', () => {
    it('should render helperText when variant is not error', () => {
      // Arrange & Act
      render(<SelectFooter idField="field" variant="default" helperText="Choose wisely" />)

      // Assert
      expect(screen.getByText('Choose wisely')).toBeInTheDocument()
    })

    it('should render helperText when variant is success', () => {
      // Arrange & Act
      render(<SelectFooter idField="field" variant="success" helperText="Looks good" />)

      // Assert
      expect(screen.getByText('Looks good')).toBeInTheDocument()
    })

    it('should not render helperText when variant is error', () => {
      // Arrange & Act
      render(<SelectFooter idField="field" variant="error" helperText="Choose wisely" />)

      // Assert
      expect(screen.queryByText('Choose wisely')).not.toBeInTheDocument()
    })

    it('should not render anything when helperText is undefined', () => {
      // Arrange & Act
      const { container } = render(<SelectFooter idField="field" variant="default" />)

      // Assert
      expect(container).toBeEmptyDOMElement()
    })
  })
})
