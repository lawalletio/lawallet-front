import { BitcoinCircleIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import type { Meta, StoryObj } from '@storybook/react'

import { LinkSetting } from '@/components/UI'

const meta = {
  title: 'Atoms/LinkSetting',
  component: LinkSetting,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof LinkSetting>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    children: 'Link setting',
    href: ''
  }
}
