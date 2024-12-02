import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import '@testing-library/jest-dom'

describe('MuiThemeProvider', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <MuiThemeProvider theme={{}}>
        <div>Test Child</div>
      </MuiThemeProvider>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
  })
})
