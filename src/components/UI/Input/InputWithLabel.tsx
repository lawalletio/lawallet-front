'use client'

import Label from '../Label'
import Flex from '../Flex'
import Input from './'

interface InputWithLabelProps {
  label: string
  name: string
  placeholder: string
  type?: 'text' | 'password' | 'number'
  onChange: (e: any) => void
}

export default function InputWithLabel(props: InputWithLabelProps) {
  const { label, name } = props

  return (
    <Flex direction="column" gap={8}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} {...props} />
    </Flex>
  )
}
