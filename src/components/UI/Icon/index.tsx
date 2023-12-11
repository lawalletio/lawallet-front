'use client'

import { ReactNode } from 'react'
import { Icon as Default } from './style'

interface ComponentProps {
  children?: ReactNode
  size?: 'small' | 'normal'
  color?: string
}

export default function Icon(props: ComponentProps) {
  const { children, size = 'normal', color = 'currentColor' } = props

  const isSmall = size === 'small'

  return (
    <Default $isSmall={isSmall} $color={color}>
      {children}
    </Default>
  )
}
