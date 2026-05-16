import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { IconButton } from './IconButton'

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    icon: 'RiHomeLine',
    variant: 'primary',
    size: 'medium',
    shape: 'square',
  },
  argTypes: {
    icon: {
      control: { type: 'text' },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text', 'warning', 'error', 'information'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Circle: Story = {
  args: {
    shape: 'circle',
  },
}

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} shape="square" aria-label="Square icon button" />
      <IconButton {...args} shape="circle" aria-label="Circle icon button" />
    </div>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton {...args} variant="primary" aria-label="Primary" />
      <IconButton {...args} variant="secondary" aria-label="Secondary" />
      <IconButton {...args} variant="text" aria-label="Text" />
      <IconButton {...args} variant="warning" aria-label="Warning" />
      <IconButton {...args} variant="error" aria-label="Error" />
      <IconButton {...args} variant="information" aria-label="Information" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} size="small" aria-label="Small" />
      <IconButton {...args} size="medium" aria-label="Medium" />
      <IconButton {...args} size="large" aria-label="Large" />
    </div>
  ),
}

export const CircleSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <IconButton {...args} shape="circle" size="small" aria-label="Small circle" />
      <IconButton {...args} shape="circle" size="medium" aria-label="Medium circle" />
      <IconButton {...args} shape="circle" size="large" aria-label="Large circle" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}
