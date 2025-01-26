import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Drawer } from './Drawer'

describe('Drawer Component', () => {
  it('should render correctly when open is true', () => {
    render(
      <Drawer open={true} onClose={() => {}} anchor="left">
        <div>Drawer Content</div>
      </Drawer>
    )

    expect(screen.getByText('Drawer Content')).toBeInTheDocument()
  })
})
