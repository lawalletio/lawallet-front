import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '@/components/UI'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      description: '',
      defaultValue: 'Input text',
      type: 'string'
    },
    status: {
      description: '',
      control: { type: 'radio' },
      options: ['success', 'error']
    },
    autoFocus: {
      description: '',
      defaultValue: false,
      type: 'boolean'
    },
    isLoading: {
      description: '',
      defaultValue: false,
      type: 'boolean'
    },
    isChecked: {
      description: '',
      defaultValue: false,
      type: 'boolean'
    },
    isError: {
      description: '',
      defaultValue: false,
      type: 'boolean'
    },
    disabled: {
      description: '',
      defaultValue: false,
      type: 'boolean'
    },
    onChange: {
      description: '',
      type: 'function'
    }
  }
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    placeholder: 'Input text',
    type: 'text'
  }
}

export const isLoading: Story = {
  args: {
    placeholder: 'Input text',
    isLoading: true
  }
}

export const isChecked: Story = {
  args: {
    placeholder: 'Input text',
    status: 'success',
    isChecked: true
  }
}

export const isError: Story = {
  args: {
    placeholder: 'Input text',
    status: 'error',
    isError: true
  }
}

export const isDisabled: Story = {
  args: {
    placeholder: 'Input text',
    disabled: true
  }
}
