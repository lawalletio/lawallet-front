'use client'

import { ReactNode } from 'react'
import Text from '../Text'
import { Label } from './style'

interface LabelProps {
  children: ReactNode
  htmlFor: string
}

export default function Component(props: LabelProps) {
  const { children, htmlFor } = props

  return (
    <Label htmlFor={htmlFor}>
      <Text size="small">{children}</Text>
    </Label>
  )
}
