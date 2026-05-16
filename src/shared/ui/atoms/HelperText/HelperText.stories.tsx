import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { HelperText } from './HelperText'

const meta: Meta<typeof HelperText> = {
  title: 'Atoms/HelperText',
  component: HelperText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The helper text content',
    },
    idField: {
      control: 'text',
      description: 'The base id for the helper text element',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success', 'warning', 'info'],
      description: 'The variant that determines the color',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the text',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show an icon for the variant',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This is a default helper text',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Helper text with icon',
    variant: 'info',
    showIcon: true,
  },
}

export const Variants: Story = {
  args: {},
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      <HelperText {...args} variant="default">
        This is a default helper text
      </HelperText>
      <HelperText {...args} variant="error">
        This is an error helper text
      </HelperText>
      <HelperText {...args} variant="success">
        This is a success helper text
      </HelperText>
      <HelperText {...args} variant="warning">
        This is a warning helper text
      </HelperText>
      <HelperText {...args} variant="info">
        This is an info helper text
      </HelperText>
    </div>
  ),
}

export const WithIcons: Story = {
  args: {},
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      <HelperText {...args} variant="error" showIcon>
        Error with icon
      </HelperText>
      <HelperText {...args} variant="success" showIcon>
        Success with icon
      </HelperText>
      <HelperText {...args} variant="warning" showIcon>
        Warning with icon
      </HelperText>
      <HelperText {...args} variant="info" showIcon>
        Info with icon
      </HelperText>
    </div>
  ),
}

export const Sizes: Story = {
  args: {},
  render: (args) => (
    <div className="grid grid-cols-1 gap-4">
      <HelperText {...args} size="small">
        This is a small helper text
      </HelperText>
      <HelperText {...args} size="medium">
        This is a medium helper text
      </HelperText>
      <HelperText {...args} size="large">
        This is a large helper text
      </HelperText>
    </div>
  ),
}

export const CustomColors: Story = {
  args: {},
  render: (args) => (
    <div className="grid grid-cols-1 gap-4">
      <HelperText {...args} variant="default" className="text-purple-500">
        Default variant with custom purple color
      </HelperText>
      <HelperText {...args} variant="error" className="text-pink-500">
        Error variant with custom pink color
      </HelperText>
      <HelperText {...args} variant="success" className="text-teal-500">
        Success variant with custom teal color
      </HelperText>
      <HelperText {...args} variant="warning" className="text-orange-500">
        Warning variant with custom orange color
      </HelperText>
      <HelperText {...args} variant="info" className="text-indigo-500">
        Info variant with custom indigo color
      </HelperText>
    </div>
  ),
}
