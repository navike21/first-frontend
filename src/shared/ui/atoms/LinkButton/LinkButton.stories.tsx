import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LinkButton } from './LinkButton'

const meta = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  args: {
    href: '/',
    children: 'LinkButton',
    variant: 'primary',
    size: 'medium',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    icon: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof LinkButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'With icon',
    icon: 'RiArrowRightLine',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <LinkButton {...args} size="small">
        Small
      </LinkButton>
      <LinkButton {...args} size="medium">
        Medium
      </LinkButton>
      <LinkButton {...args} size="large">
        Large
      </LinkButton>
    </div>
  ),
}
