'use client'

import { ReactNode } from 'react'
import { Avatar } from './style'

interface ComponentProps {
  children: ReactNode
  size?: 'normal' | 'large'
}

export default function Component(props: ComponentProps) {
  const { children, size = 'normal' } = props

  const isNormal = size === 'normal'

  return <Avatar $isNormal={isNormal}>{children}</Avatar>
}
