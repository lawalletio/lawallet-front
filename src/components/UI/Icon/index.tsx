'use client'

import { ReactNode } from 'react'
import { Icon } from './style'

interface ComponentProps {
  children: ReactNode
  size?: 'small' | 'normal'
  color?: string
}

export default function Component(props: ComponentProps) {
  const { children, size = 'normal', color = 'currentColor' } = props

  const isSmall = size === 'small'

  return (
    <Icon $isSmall={isSmall} $color={color}>
      {children}
    </Icon>
  )
}
