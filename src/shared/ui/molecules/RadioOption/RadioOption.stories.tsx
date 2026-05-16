import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { RadioOption } from './RadioOption'

const meta: Meta<typeof RadioOption> = {
  title: 'Forms/RadioOption',
  component: RadioOption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text for the radio option',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the radio option',
    },
    error: {
      control: 'boolean',
      description: 'Whether the radio option has an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio option is disabled',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio option is checked',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Option A',
  },
}

export const Checked: Story = {
  args: {
    label: 'Selected option',
    checked: true,
    onChange: () => {},
  },
}

export const DefaultChecked: Story = {
  args: {
    label: 'Pre-selected option',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled and checked',
    disabled: true,
    defaultChecked: true,
  },
}

export const ErrorVariant: Story = {
  args: {
    label: 'Invalid option',
    error: true,
    errorMessage: 'This field is required.',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Option with helper',
    helperText: 'Select this option to proceed.',
  },
}

export const GroupExample: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <RadioOption label="Option A" name="group" value="a" />
      <RadioOption label="Option B" name="group" value="b" defaultChecked />
      <RadioOption label="Option C" name="group" value="c" />
      <RadioOption label="Disabled option" name="group" value="d" disabled />
    </div>
  ),
}
