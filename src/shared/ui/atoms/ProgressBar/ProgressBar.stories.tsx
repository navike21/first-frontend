import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    value: 50,
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Values: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-4">
      <ProgressBar {...args} value={0} />
      <ProgressBar {...args} value={30} />
      <ProgressBar {...args} value={65} />
      <ProgressBar {...args} value={100} />
    </div>
  ),
}
