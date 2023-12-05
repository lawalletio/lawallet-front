import type { Meta, StoryObj } from '@storybook/react'

import { Heading } from '@/components/UI'

const meta = {
  title: 'Atoms/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    as: {
      description: 'h1, h2, h3, h4, h5 or h6',
      defaultValue: 'h1'
    }
  }
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.'
  }
}

export const asH2: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    as: 'h2'
  }
}

export const asH3: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    as: 'h3'
  }
}

export const leftAlign: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    align: 'left'
  }
}

export const centerAlign: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    align: 'center'
  }
}

export const rightAlign: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    align: 'right'
  }
}

export const withColor: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet magna aliqua.',
    color: 'red'
  }
}
