'use client'

import { ReactNode } from 'react'
import { InputGroup } from './style'

interface InputGroupProps {
  children: ReactNode
}

export default function Component(props: InputGroupProps) {
  const { children } = props

  return <InputGroup>{children}</InputGroup>
}
