'use client'

import { ReactNode } from 'react'
import { ButtonGroup } from './style'

interface ComponentProps {
  children: ReactNode
}

export default function Component(props: ComponentProps) {
  const { children } = props

  return <ButtonGroup>{children}</ButtonGroup>
}
