import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Flex, Button, Text } from '@/components/UI'

const meta = {
  title: 'Atoms/Flex',
  component: Flex,
  tags: ['autodocs'],
  argTypes: {
    children: {
      type: 'function'
    }
  }
} satisfies Meta<typeof Flex>

export default meta
type Story = StoryObj<typeof meta>

export const defaultComponent: Story = {
  args: {
    direction: 'row'
  },
  render: args => (
    <Flex {...args}>
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa
        similique eveniet quam! Consectetur, quis! Labore eveniet, quod
        veritatis quis, ipsam repudiandae ut cupiditate, ipsum saepe pariatur
        nobis. Dignissimos, eos doloremque.
      </Text>
      <Button onClick={() => null}>+</Button>
    </Flex>
  )
}

export const columnDirection: Story = {
  args: {
    direction: 'column'
  },
  render: args => (
    <Flex {...args}>
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa
        similique eveniet quam! Consectetur, quis! Labore eveniet, quod
        veritatis quis, ipsam repudiandae ut cupiditate, ipsum saepe pariatur
        nobis. Dignissimos, eos doloremque.
      </Text>
      <Button onClick={() => null}>+</Button>
    </Flex>
  )
}

export const centerAlign: Story = {
  args: {
    direction: 'row',
    align: 'center'
  },
  render: args => (
    <Flex {...args}>
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa
        similique eveniet quam! Consectetur, quis! Labore eveniet, quod
        veritatis quis, ipsam repudiandae ut cupiditate, ipsum saepe pariatur
        nobis. Dignissimos, eos doloremque.Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Culpa similique eveniet quam! Consectetur,
        quis! Labore eveniet, quod veritatis quis, ipsam repudiandae ut
        cupiditate, ipsum saepe pariatur nobis. Dignissimos, eos doloremque.
      </Text>
      <Button onClick={() => null}>+</Button>
    </Flex>
  )
}

export const startJustify: Story = {
  args: {
    direction: 'row',
    justify: 'start'
  },
  render: args => (
    <Flex {...args}>
      <Button size="small" variant="bezeledGray" onClick={() => null}>
        +
      </Button>
      <Button size="small" onClick={() => null}>
        +
      </Button>
    </Flex>
  )
}

export const centerJustify: Story = {
  args: {
    direction: 'row',
    justify: 'center'
  },
  render: args => (
    <Flex {...args}>
      <Button size="small" variant="bezeledGray" onClick={() => null}>
        +
      </Button>
      <Button size="small" onClick={() => null}>
        +
      </Button>
    </Flex>
  )
}

export const endJustify: Story = {
  args: {
    direction: 'row',
    justify: 'end'
  },
  render: args => (
    <Flex {...args}>
      <Button size="small" variant="bezeledGray" onClick={() => null}>
        +
      </Button>
      <Button size="small" onClick={() => null}>
        +
      </Button>
    </Flex>
  )
}

export const spaceBetweenJustify: Story = {
  args: {
    direction: 'row',
    justify: 'space-between'
  },
  render: args => (
    <Flex {...args}>
      <Button size="small" variant="bezeledGray" onClick={() => null}>
        +
      </Button>
      <Button size="small" onClick={() => null}>
        +
      </Button>
    </Flex>
  )
}
