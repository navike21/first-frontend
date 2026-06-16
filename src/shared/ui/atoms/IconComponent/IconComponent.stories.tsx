import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { IconComponent } from './IconComponent'

const meta = {
  title: 'Atoms/IconComponent',
  component: IconComponent,
  tags: ['autodocs'],
  args: {
    icon: 'RiHomeLine',
    className: 'w-8 h-8',
  },
  argTypes: {
    icon: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof IconComponent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <IconComponent {...args} className="h-4 w-4" />
      <IconComponent {...args} className="h-8 w-8" />
      <IconComponent {...args} className="h-12 w-12" />
    </div>
  ),
}
