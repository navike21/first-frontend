import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PageHeader } from './PageHeader'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      to,
      children,
      className,
    }: {
      to: string
      children: React.ReactNode
      className?: string
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }
})

describe('PageHeader', () => {
  it('should render the title', () => {
    render(<PageHeader title="Plantillas" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Plantillas')
  })

  it('should render the description when provided', () => {
    render(<PageHeader title="Plantillas" description="Descripción de prueba" />)
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument()
  })

  it('should not render a description element when omitted', () => {
    render(<PageHeader title="Plantillas" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('should not render the actions area when actions is empty', () => {
    render(<PageHeader title="Plantillas" actions={[]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render a button action and call onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <PageHeader
        title="Plantillas"
        actions={[{ type: 'button', label: 'Exportar', onClick }]}
      />
    )
    const btn = screen.getByRole('button', { name: 'Exportar' })
    expect(btn).toBeInTheDocument()
    await user.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should render a link action with the correct href', () => {
    render(
      <PageHeader
        title="Plantillas"
        actions={[{ type: 'link', label: 'Crear', to: '/configuracion/plantillas/crear' }]}
      />
    )
    const link = screen.getByRole('link', { name: 'Crear' })
    expect(link).toHaveAttribute('href', '/configuracion/plantillas/crear')
  })

  it('should render multiple actions', () => {
    const onClick = vi.fn()
    render(
      <PageHeader
        title="Plantillas"
        actions={[
          { type: 'link', label: 'Crear', to: '/configuracion/plantillas/crear' },
          { type: 'button', label: 'Exportar', onClick },
        ]}
      />
    )
    expect(screen.getByRole('link', { name: 'Crear' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exportar' })).toBeInTheDocument()
  })

  it('should render a disabled button when disabled is true', () => {
    render(
      <PageHeader
        title="Plantillas"
        actions={[{ type: 'button', label: 'Guardar', onClick: vi.fn(), disabled: true }]}
      />
    )
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled()
  })
})
