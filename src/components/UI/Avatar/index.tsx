'use client'

import { ReactNode } from 'react'
import { Avatar as Default } from './style'

interface ComponentProps {
  children: ReactNode
  size?: 'normal' | 'large'
}

export default function Avatar(props: ComponentProps) {
  const { children, size = 'normal' } = props

  const isNormal = size === 'normal'

  return <Default $isNormal={isNormal}>{children}</Default>
}
