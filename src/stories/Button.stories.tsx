import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '@/components/UI'

const meta = {
  title: 'UI Kit/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    color: {
      description: '',
      defaultValue: 'primary'
    },
    variant: {
      description: '',
      defaultValue: 'filled'
    },
    size: {
      description: '',
      defaultValue: 'normal'
    }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const primaryColor: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'filled',
    size: 'normal'
  }
}

export const secondaryColor: Story = {
  args: {
    children: 'Button',
    color: 'secondary'
  }
}

export const errorColor: Story = {
  args: {
    children: 'Button',
    color: 'error'
  }
}

export const filledVariant: Story = {
  args: {
    children: 'Button',
    variant: 'filled'
  }
}

export const bezeledVariant: Story = {
  args: {
    children: 'Button',
    variant: 'bezeled'
  }
}

export const bezeledGrayVariant: Story = {
  args: {
    children: 'Button',
    variant: 'bezeledGray'
  }
}

export const borderlessVariant: Story = {
  args: {
    children: 'Button',
    variant: 'borderless'
  }
}

export const smallSize: Story = {
  args: {
    children: 'Button',
    size: 'small'
  }
}

export const normalSize: Story = {
  args: {
    children: 'Button',
    size: 'normal'
  }
}
