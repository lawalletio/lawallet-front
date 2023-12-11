import type { Meta, StoryObj } from '@storybook/react'

import { Avatar } from '@/components/UI'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    children: 'SA'
  }
}

export const largeSize: Story = {
  args: {
    children: 'SA',
    size: 'large'
  }
}
