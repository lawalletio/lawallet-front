'use client'

import Container from '../Container'
import Divider from '../../UI/Divider'

import { Footer } from './style'
import { ReactNode } from 'react'

interface ComponentProps {
  children?: ReactNode
}

export default function Component(props: ComponentProps) {
  const { children } = props

  return (
    <Footer>
      <Divider y={12} />
      <Container size="small">{children}</Container>
      <Divider y={24} />
    </Footer>
  )
}
