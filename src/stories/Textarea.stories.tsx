import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from '@/components/UI'

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    placeholder: "I'm a Textarea!"
  }
}

export const isSuccess: Story = {
  args: {
    placeholder: "I'm a Textarea!",
    status: 'success'
  }
}

export const isError: Story = {
  args: {
    placeholder: "I'm a Textarea!",
    status: 'error'
  }
}

export const disabled: Story = {
  args: {
    placeholder: "I'm a Textarea!",
    disabled: true
  }
}
