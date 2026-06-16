import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { IconComponent } from '@Components/atoms/IconComponent/IconComponent'

import { InputField } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Forms/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'error', 'warning'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    leftSlot: {
      control: false,
    },
    rightSlot: {
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Name:',
    placeholder: 'Enter your name',
    type: 'text',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Address:',
    placeholder: 'Enter your address',
    type: 'text',
    helperText: 'Please enter a valid address',
  },
}

export const Variants: Story = {
  args: {},
  render: (args) => {
    const { ...otherArgs } = args
    return (
      <div className="grid grid-cols-2 gap-4">
        <InputField
          {...otherArgs}
          label="Default variant:"
          variant="default"
          placeholder="Default variant"
        />
        <InputField
          {...otherArgs}
          label="Success variant:"
          variant="success"
          placeholder="Success variant"
        />
        <InputField
          {...otherArgs}
          label="Error variant:"
          variant="error"
          placeholder="Error variant"
        />
        <InputField
          {...otherArgs}
          label="Warning variant:"
          variant="warning"
          placeholder="Warning variant"
        />
      </div>
    )
  },
}

export const WithLeftSlot: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    leftSlot: <IconComponent icon="RiSearchLine" className="text-slate-500" />,
  },
}

export const WithRightSlot: Story = {
  args: {
    label: 'Amount',
    placeholder: '0.00',
    rightSlot: <span className="text-slate-500">USD</span>,
  },
}

export const Loading: Story = {
  args: {
    label: 'Loading...',
    placeholder: 'Loading data',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
  },
}

export const PasswordToggle: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
  },
}

export const EmailField: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

export const WithErrorMessage: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    variant: 'error',
    errorMessage: 'Please enter a valid email address',
  },
}

export const HelperTextAsReactNode: Story = {
  args: {
    label: 'Rich Helper',
    placeholder: 'Enter text',
    leftSlot: (
      <IconComponent icon="RiInformation2Line" className="text-slate-500" />
    ),
    helperText: (
      <div>
        <strong>Tip:</strong> Use <em>markdown</em> syntax
      </div>
    ),
  },
}

export const CustomClasses: Story = {
  args: {
    label: 'Custom Styled',
    placeholder: 'Custom input',
    className: 'max-w-sm',
    classInput: 'border-2 border-blue-500',
  },
}

export const AllStates: Story = {
  args: {},
  render: (args) => {
    const { ...otherArgs } = args
    return (
      <div className="grid w-full max-w-md grid-cols-2 gap-6">
        <InputField {...otherArgs} label="Normal State" placeholder="Normal" />
        <InputField
          {...otherArgs}
          label="Loading State"
          placeholder="Loading"
          loading
        />
        <InputField
          {...otherArgs}
          label="Disabled State"
          placeholder="Disabled"
          disabled
        />
        <InputField
          {...otherArgs}
          label="Error State"
          placeholder="Error"
          variant="error"
          errorMessage="This field is required"
        />
        <InputField
          {...otherArgs}
          label="Success State"
          placeholder="Success"
          variant="success"
          helperText="Looks good!"
        />
      </div>
    )
  },
}
