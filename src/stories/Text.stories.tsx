import type { Meta, StoryObj } from '@storybook/react'

import { Text } from '@/components/UI'

const meta = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: '',
      defaultValue: 'normal'
    },
    align: {
      description: '',
      defaultValue: 'left'
    }
  }
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }
}

export const isBold: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isBold: true
  }
}

export const smallSize: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    size: 'small'
  }
}

export const normalSize: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    size: 'normal'
  }
}

export const leftAlign: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    align: 'left'
  }
}

export const centerAlign: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    align: 'center'
  }
}

export const rightAlign: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    align: 'right'
  }
}

export const withColor: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    color: 'red'
  }
}
