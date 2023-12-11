'use client'

import { Text as Default } from './style'
import { ReactNode } from 'react'

type Size = 'small' | 'normal'
type Align = 'left' | 'center' | 'right'

interface TextProps {
  children: ReactNode
  size?: Size
  align?: Align
  isBold?: boolean
  color?: string
}

export default function Text(props: TextProps) {
  const {
    children,
    size = 'normal',
    align = 'left',
    isBold = false,
    color
  } = props

  return (
    <Default
      $isSmall={size === 'small'}
      $align={align}
      $isBold={isBold}
      $color={color}
    >
      {children}
    </Default>
  )
}
