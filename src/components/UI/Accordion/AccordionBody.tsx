'use client'

import { ReactNode } from 'react'
import { AccordionBody } from './style'

interface ComponentProps {
  children: ReactNode
}

export default function Component(props: ComponentProps) {
  const { children } = props

  return <AccordionBody>{children}</AccordionBody>
}
