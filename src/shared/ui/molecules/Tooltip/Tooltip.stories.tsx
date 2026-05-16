import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Tooltip } from './Tooltip'
import { Button } from '../../../atoms/Button/Button'

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'This is a tooltip',
    position: 'top',
    variant: 'dark',
    size: 'medium',
    children: <Button>Hover or click me</Button>,
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'auto'],
    },
    variant: {
      control: { type: 'select' },
      options: ['dark', 'light'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    content: {
      control: { type: 'text' },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-20">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positions: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-16 p-10">
      <Tooltip {...args} position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip {...args} position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip {...args} position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip {...args} position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
}

export const AutoPosition: Story = {
  render: (args) => (
    <div className="flex h-screen flex-col justify-between py-4">
      <Tooltip {...args} position="auto" content="Auto: near top → shows below">
        <Button>Near top of viewport</Button>
      </Tooltip>
      <Tooltip {...args} position="auto" content="Auto: near bottom → shows above">
        <Button>Near bottom of viewport</Button>
      </Tooltip>
    </div>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Tooltip {...args} variant="dark">
        <Button>Dark</Button>
      </Tooltip>
      <Tooltip {...args} variant="light">
        <Button variant="secondary">Light</Button>
      </Tooltip>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Tooltip {...args} size="small" content="Small tooltip">
        <Button size="small">Small</Button>
      </Tooltip>
      <Tooltip {...args} size="medium" content="Medium tooltip">
        <Button size="medium">Medium</Button>
      </Tooltip>
      <Tooltip {...args} size="large" content="Large tooltip">
        <Button size="large">Large</Button>
      </Tooltip>
    </div>
  ),
}

export const RichContent: Story = {
  args: {
    content: (
      <span>
        <strong>Bold</strong> and regular text
      </span>
    ),
  },
}

export const LightVariant: Story = {
  args: {
    variant: 'light',
    children: <Button variant="secondary">Light tooltip</Button>,
  },
}
