'use client'

import { ReactNode } from 'react'
import { ContainerCustom } from './style'

interface ContainerProps {
  children: ReactNode
  size?: 'small' | 'medium'
}

export default function Container(props: ContainerProps) {
  const { children, size = 'medium' } = props

  return (
    <ContainerCustom $isSmall={size === 'small'}>{children}</ContainerCustom>
  )
}
