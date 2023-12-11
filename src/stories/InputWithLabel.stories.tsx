import type { Meta, StoryObj } from '@storybook/react'

import { InputWithLabel } from '@/components/UI'

const meta = {
  title: 'Atoms/Input/With label',
  component: InputWithLabel,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    placeholder: {
      type: 'string'
    }
  }
} satisfies Meta<typeof InputWithLabel>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    label: 'Label',
    name: 'input-with-label',
    placeholder: 'Input'
  }
}
