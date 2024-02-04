'use client'

import Label from '../Label'
import Flex from '../Flex'
import Input from './'

interface InputWithLabelProps {
  label: string
  name: string
  placeholder: string
  type?: 'text' | 'password' | 'number'
  value?: string
  isError?: boolean
  onChange?: (e: any) => void
  onFocus?: (e: any) => void
  onBlur?: (e: any) => void
}

export default function Component(props: InputWithLabelProps) {
  const { label, name, value = '' } = props

  return (
    <Flex direction="column" gap={8}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} value={value} {...props} />
    </Flex>
  )
}
