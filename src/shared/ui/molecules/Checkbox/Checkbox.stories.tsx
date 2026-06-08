import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text for the checkbox',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the checkbox',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    error: {
      control: 'boolean',
      description: 'Whether the checkbox has an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    helperText: 'By checking this box, you agree to our terms.',
  },
}

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    checked: true,
    helperText: 'You will receive updates via email.',
  },
}

export const DefaultChecked: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
    helperText: 'You can change this later in settings.',
  },
}

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    indeterminate: true,
    helperText: 'Some items are selected.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    helperText: 'This option is not available.',
  },
}

export const ErrorField: Story = {
  args: {
    label: 'Agree to terms',
    error: true,
    errorMessage: 'You must accept the terms to continue.',
  },
}

export const WithLongText: Story = {
  args: {
    label:
      'This is a very long label that demonstrates how the checkbox handles longer text content in the label field',
    helperText:
      'This helper text is also quite long to show how the component handles extended descriptions and additional information.',
  },
}
