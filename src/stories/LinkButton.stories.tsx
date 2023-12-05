import type { Meta, StoryObj } from '@storybook/react'

import { LinkButton } from '@/components/UI'

const meta = {
  title: 'Atoms/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  argTypes: {
    href: {
      description: '',
      defaultValue: '#',
      type: 'string'
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
} satisfies Meta<typeof LinkButton>

export default meta
type Story = StoryObj<typeof meta>

export const primaryColor: Story = {
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'filled',
    size: 'normal',
    href: ''
  }
}

export const secondaryColor: Story = {
  args: {
    children: 'Button',
    color: 'secondary',
    href: ''
  }
}

export const errorColor: Story = {
  args: {
    children: 'Button',
    color: 'error',
    href: ''
  }
}

export const filledVariant: Story = {
  args: {
    children: 'Button',
    variant: 'filled',
    href: ''
  }
}

export const bezeledVariant: Story = {
  args: {
    children: 'Button',
    variant: 'bezeled',
    href: ''
  }
}

export const bezeledGrayVariant: Story = {
  args: {
    children: 'Button',
    variant: 'bezeledGray',
    href: ''
  }
}

export const borderlessVariant: Story = {
  args: {
    children: 'Button',
    variant: 'borderless',
    href: ''
  }
}

export const smallSize: Story = {
  args: {
    children: 'Button',
    size: 'small',
    href: ''
  }
}

export const normalSize: Story = {
  args: {
    children: 'Button',
    size: 'normal',
    href: ''
  }
}
