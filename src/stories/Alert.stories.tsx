import type { Meta, StoryObj } from '@storybook/react'

import { Alert } from '@/components/UI'

const meta = {
  title: 'Atoms/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    description: {
      type: 'string'
    }
  }
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    isOpen: true,
    type: 'success',
    title: '',
    description: ''
  }
}

export const isError: Story = {
  args: {
    isOpen: true,
    type: 'error',
    title: '',
    description: ''
  }
}
