import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Spinner } from './Spinner'

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'white', 'gradient'],
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Sizes: Story = {
  args: {},
  render: (args) => (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center gap-2 rounded bg-white p-4">
        <span className="text-sm text-gray-600">Small</span>
        <Spinner {...args} size="small" />
      </div>
      <div className="flex flex-col items-center gap-2 rounded bg-white p-4">
        <span className="text-sm text-gray-600">Medium</span>
        <Spinner {...args} size="medium" />
      </div>
      <div className="flex flex-col items-center gap-2 rounded bg-white p-4">
        <span className="text-sm text-gray-600">Large</span>
        <Spinner {...args} size="large" />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  args: {},
  render: (args) => {
    const { ...otherArgs } = args
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2 rounded bg-white p-4">
          <span className="text-sm text-gray-600">Default</span>
          <Spinner {...otherArgs} variant="default" />
        </div>
        <div className="flex flex-col items-center gap-2 rounded bg-slate-800 p-4">
          <span className="text-sm text-gray-300">White</span>
          <Spinner {...otherArgs} variant="white" />
        </div>
        <div className="flex flex-col items-center gap-2 rounded bg-white p-4">
          <span className="text-sm text-gray-600">Gradient</span>
          <Spinner {...otherArgs} variant="gradient" />
        </div>
      </div>
    )
  },
}
