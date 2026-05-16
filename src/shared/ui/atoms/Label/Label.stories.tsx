import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Label } from './Label'

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content of the label'
    },
    htmlFor: {
      control: 'text',
      description: 'The id of the form control that the label is labeling'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the label appears disabled'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'email'
  }
}

export const Disabled: Story = {
  args: {
    children: 'Disabled label',
    disabled: true
  }
}

export const WithCustomClass: Story = {
  args: {
    children: 'Custom styled label',
    className: 'text-blue-500 font-bold'
  }
}
