import type { Meta, StoryObj } from '@storybook/react'

import { CardAlert } from '@/components/UI'

const meta = {
  title: 'Atoms/CardAlert',
  component: CardAlert,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof CardAlert>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    title: 'Hello world!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    isHome: false
  }
}

export const isHome: Story = {
  args: {
    title: 'Hello world!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    isHome: true
  }
}
