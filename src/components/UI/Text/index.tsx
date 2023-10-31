'use client'

import { fontSecondary } from '@/styles/fonts'

import { Text } from './style'
import { ReactNode } from 'react'

interface TextProps {
  children: ReactNode
  size?: 'small' | 'normal'
  align?: 'left' | 'center' | 'right'
  isBold?: boolean
  color?: string
}

export default function Component(props: TextProps) {
  const {
    children,
    size = 'normal',
    align = 'left',
    isBold = false,
    color
  } = props

  return (
    <Text
      $isSmall={size === 'small'}
      $align={align}
      $isBold={isBold}
      $color={color}
      className={fontSecondary.className}
    >
      {children}
    </Text>
  )
}
