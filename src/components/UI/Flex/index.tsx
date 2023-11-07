'use client'

import { ReactNode } from 'react'
import { FlexCustom } from './style'

interface FlexProps {
  children: ReactNode
  gap?: 0 | 2 | 4 | 8
  direction?: 'row' | 'column'
  flex?: 0 | 1 | 'initial'
  justify?: 'start' | 'end' | 'space-between' | 'center'
  align?: 'start' | 'center' | 'end'
  onClick?: (e: any) => void
}

export default function Flex(props: FlexProps) {
  const {
    children,
    gap = 0,
    direction = 'row',
    flex = 'initial',
    justify = 'start',
    align = 'start',
    onClick = () => null
  } = props

  return (
    <FlexCustom
      onClick={onClick}
      $gap={`${gap}px`}
      $direction={direction}
      $flex={flex}
      $justify={justify}
      $align={align}
    >
      {children}
    </FlexCustom>
  )
}
