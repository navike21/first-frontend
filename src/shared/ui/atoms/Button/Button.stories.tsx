import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'medium',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    icon: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 items-start">
      <Button {...args} size="small">
        Small
      </Button>
      <Button {...args} size="medium">
        Medium
      </Button>
      <Button {...args} size="large">
        Large
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    children: 'With icon',
    icon: 'RiHomeLine',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading',
  },
}

export const LoadingWithIcon: Story = {
  tags: ['important'],
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
        <span className="text-xs text-gray-700">
          (Icon is hidden when loading is true to avoid confusion)
        </span>
      </div>
    ),
  ],
  args: {
    loading: true,
    icon: 'RiHomeLine',
    children: 'Loading with icon',
  },
  render: (args) => <Button {...args}>Loading with icon</Button>,
}

export const TextVariant: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
}
