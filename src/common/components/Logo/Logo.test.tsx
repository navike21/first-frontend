import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Logo } from './Logo'
import { ESizes } from '@Enums/size'

describe('Logo Component', () => {
  const theme = createTheme()

  it('renders correctly with default props', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo />
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly with showRadar prop', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo showRadar />
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly with onlyIsoLogo prop', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo onlyIsoLogo />
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly with different size prop', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo size={ESizes.LG} />
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders correctly with different direction prop', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Logo direction="column" />
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
