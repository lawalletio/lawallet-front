import { BitcoinCircleIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from '@/components/UI'

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    size: 'normal'
  },
  render: args => (
    <Icon {...args}>
      <BitcoinCircleIcon />
    </Icon>
  )
}

export const smallSize: Story = {
  args: {
    size: 'small'
  },
  render: args => (
    <Icon {...args}>
      <BitcoinCircleIcon />
    </Icon>
  )
}

export const withColor: Story = {
  args: {
    color: 'red'
  },
  render: args => (
    <Icon {...args}>
      <BitcoinCircleIcon />
    </Icon>
  )
}
