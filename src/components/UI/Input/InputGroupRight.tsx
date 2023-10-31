'use client'

import { ReactNode } from 'react'
import { InputGroupRight } from './style'

interface InputGroupRightProps {
  children: ReactNode
}

export default function Component(props: InputGroupRightProps) {
  const { children } = props

  return <InputGroupRight>{children}</InputGroupRight>
}
