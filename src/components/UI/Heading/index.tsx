'use client'

import { HeadingBox, HeadingCustom } from './style'
import { ReactNode } from 'react'

interface HeadingProps {
  children: ReactNode
  as?: string
  align?: 'left' | 'center' | 'right'
  color?: string
}

export default function Heading(props: HeadingProps) {
  const { children, as = 'h1', align = 'left', color } = props

  return (
    <HeadingBox>
      <HeadingCustom as={as} $align={align} $color={color}>
        {children}
      </HeadingCustom>
    </HeadingBox>
  )
}
