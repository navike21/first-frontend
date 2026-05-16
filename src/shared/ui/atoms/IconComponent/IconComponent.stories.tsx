import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { IconComponent } from './IconComponent'

const meta = {
  title: 'Atoms/IconComponent',
  component: IconComponent,
  tags: ['autodocs'],
  args: {
    icon: 'RiHomeLine',
    className: 'w-8 h-8'
  },
  argTypes: {
    icon: {
      control: { type: 'text' }
    },
    className: {
      control: { type: 'text' }
    }
  }
} satisfies Meta<typeof IconComponent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: args => (
    <div className="flex items-center gap-6">
      <IconComponent {...args} className="w-4 h-4" />
      <IconComponent {...args} className="w-8 h-8" />
      <IconComponent {...args} className="w-12 h-12" />
    </div>
  )
}
