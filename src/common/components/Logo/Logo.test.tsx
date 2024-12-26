import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Logo } from './Logo'

describe('Logo component', () => {
  it('renders without crashing', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo />
      </ThemeProvider>
    )
    expect(container).toBeInTheDocument()
  })

  it('contains the SVG element', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo />
      </ThemeProvider>
    )
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('applies theme colors correctly', () => {
    const theme = createTheme({
      palette: {
        primary: {
          main: '#0000ff',
          dark: '#00008b',
          light: '#add8e6',
        },
      },
    })
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo />
      </ThemeProvider>
    )
    const gradientStops = container.querySelectorAll('stop')
    expect(gradientStops[0]).toHaveAttribute('stop-color', '#00008b')
    expect(gradientStops[1]).toHaveAttribute('stop-color', '#0000ff')
    expect(gradientStops[2]).toHaveAttribute('stop-color', '#add8e6')
    expect(gradientStops[3]).toHaveAttribute('stop-color', '#0000ff')
    expect(gradientStops[4]).toHaveAttribute('stop-color', '#add8e6')
    expect(gradientStops[5]).toHaveAttribute('stop-color', '#0000ff')
  })

  it('renders radar element when showRadar is true', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo showRadar />
      </ThemeProvider>
    )
    const radarElement = container.querySelector('span')
    expect(radarElement).toBeInTheDocument()
  })

  it('renders radar element when showRadar is false', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo />
      </ThemeProvider>
    )
    const radarElement = container.querySelector('span')
    expect(radarElement).not.toBeInTheDocument()
  })

  it('sets the correct SVG width when showRadar is true', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo showRadar />
      </ThemeProvider>
    )
    const svgElement = container.querySelector('svg')
    expect(svgElement).toHaveAttribute('width', '65%')
  })

  it('sets the correct SVG width when showRadar is false', () => {
    const theme = createTheme()
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo showRadar={false} />
      </ThemeProvider>
    )
    const svgElement = container.querySelector('svg')
    expect(svgElement).toHaveAttribute('width', '100%')
  })
})
