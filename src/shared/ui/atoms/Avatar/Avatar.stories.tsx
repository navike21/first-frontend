import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Avatar } from './Avatar'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'John Doe',
    size: 'md',
    status: 'none'
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg']
    },
    status: {
      control: { type: 'select' },
      options: ['none', 'online', 'offline', 'busy', 'away']
    }
  }
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithStatus: Story = {
  args: {
    status: 'online'
  }
}

export const NoImageInitials: Story = {
  args: {
    name: 'Jane Smith',
    status: 'away'
  }
}

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&h=256&q=60',
    alt: 'User avatar',
    name: 'User avatar',
    status: 'online'
  }
}
