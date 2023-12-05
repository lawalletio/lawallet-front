import type { Meta, StoryObj } from '@storybook/react'

import { Keyboard } from '@/components/UI'

const meta = {
  title: 'Atoms/Keyboard',
  component: Keyboard,
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Keyboard>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    numpadData: {
      usedCurrency: 'SAT',
      intAmount: { SAT: 0, USD: 0, ARS: 0 },
      deleteNumber: () => null,
      concatNumber: (strNumber: string) => null,
      handleNumpad: (value: string) => null,
      resetAmount: () => null,
      modifyCurrency: currency => null,
      setCustomAmount: (amount: number, currency) => null,
      updateNumpadAmount: (new_amount: string) => null
    }
  }
}
