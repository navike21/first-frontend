# Button Component

## Overview

A flexible and customizable button component built with Material-UI and styled-components, offering enhanced functionality for loading states and responsive design.

## Features

- Support for standard Material-UI Button props
- Built-in loading state management
- Responsive design
- Customizable sizes and variants
- Dynamic styling with theme integration

## Props

| Prop     | Type                                | Default     | Description                                     |
| -------- | ----------------------------------- | ----------- | ----------------------------------------------- |
| loading  | boolean                             | false       | Activates loading state and disables the button |
| size     | 'small' \| 'medium' \| 'large'      | 'medium'    | Button size configuration                       |
| variant  | 'contained' \| 'outlined' \| 'text' | 'contained' | Button style variant                            |
| disabled | boolean                             | false       | Disables the button interaction                 |
| onClick  | function                            | -           | Click event handler                             |

## Usage Examples

### Basic Button

```typescript
import { Button } from '@Components/Button/Button'

function MyComponent() {
  return <Button>Click Me</Button>
}
```

### Loading State

```typescript
import { useState } from 'react'
import { Button } from '@Components/Button/Button'

function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Perform async operation
      await submitData()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      loading={isSubmitting}
      onClick={handleSubmit}
    >
      Submit
    </Button>
  )
}
```

### Variants and Sizes

```typescript
import { Button } from '@Components/Button/Button'

function ButtonShowcase() {
  return (
    <>
      <Button variant="contained" size="small">Small Contained</Button>
      <Button variant="outlined" size="medium">Medium Outlined</Button>
      <Button variant="text" size="large">Large Text</Button>
    </>
  )
}
```

## Styling

The Button component uses custom styled-components with Material-UI theme integration. Key styling features include:

- Responsive padding
- Dynamic loading state opacity
- Flexible content positioning
- Theme-based color and spacing

## Performance Considerations

- Uses `React.memo` for optimization
- Minimal re-renders
- Efficient loading state management

## Accessibility

- Inherits Material-UI button accessibility features
- Proper aria attributes for loading and disabled states
- Keyboard navigation support

## Custom Theming

Easily customizable through Material-UI theme provider. Can modify:

- Color schemes
- Typography
- Spacing
- Border radius

## Dependencies

- React
- Material-UI
- Styled-components

## Best Practices

1. Always provide meaningful button text
2. Use loading state for async operations
3. Consider user feedback during interactions
4. Maintain consistent design across your application
