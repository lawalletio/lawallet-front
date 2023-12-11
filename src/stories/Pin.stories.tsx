import type { Meta, StoryObj } from '@storybook/react'

import { Pin } from '@/components/UI'

const meta = {
  title: 'Atoms/Pin',
  component: Pin,
  tags: ['autodocs'],
  argTypes: {
    length: {
      defaultValue: 4,
      type: 'number'
    }
  }
} satisfies Meta<typeof Pin>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    length: 4,
    value: 'SA',
    onChange: () => null
  }
}
