import { describe, it, expect, vi } from 'vitest'
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

  it('should render correctly when open is false', () => {
    render(
      <Drawer open={false} onClose={() => {}} anchor="left">
        <div>Drawer Content</div>
      </Drawer>
    )

    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument()
  })

  it('should render correctly when titleDrawer is provided', () => {
    render(
      <Drawer
        open={true}
        onClose={() => {}}
        anchor="left"
        titleDrawer="Drawer Title"
      >
        <div>Drawer Content</div>
      </Drawer>
    )

    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
  })

  it('should render correctly when actionsButtons are provided', () => {
    render(
      <Drawer
        open={true}
        onClose={() => {}}
        anchor="left"
        actionsButtons={<button>Button</button>}
      >
        <div>Drawer Content</div>
      </Drawer>
    )

    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()

    render(
      <Drawer open={true} onClose={onClose} anchor="left">
        <div>Drawer Content</div>
      </Drawer>
    )

    const closeButton = screen.getByRole('button', {
      name: /close/i,
    })
    closeButton.click()

    expect(onClose).toHaveBeenCalled()
  })
})
