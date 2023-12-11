import type { Meta, StoryObj } from '@storybook/react'

import { BannerAlert } from '@/components/UI'

const meta = {
  title: 'Atoms/BannerAlert',
  component: BannerAlert,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof BannerAlert>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    title: 'Hello world!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    color: 'success'
  }
}

export const warningColor: Story = {
  args: {
    title: 'Hello world!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    color: 'warning'
  }
}

export const errorColor: Story = {
  args: {
    title: 'Hello world!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    color: 'error'
  }
}
