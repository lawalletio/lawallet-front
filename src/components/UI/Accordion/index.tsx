'use client'

import { ReactNode, useState } from 'react'

import AccordionTrigger from './AccordionTrigger'

import { Accordion, AccordionContent } from './style'
import theme from '@/styles/theme'

interface ComponentProps {
  children: ReactNode
  trigger: ReactNode
  variant?: 'filled' | 'borderless'
}

const variants = {
  filled: {
    background: theme.colors.gray15,
    border: theme.colors.gray20
  },
  borderless: {
    background: 'transparent',
    border: 'transparent'
  }
}

export default function Component(props: ComponentProps) {
  const { children, trigger, variant = 'filled' } = props

  const [open, setOpen] = useState(false)

  return (
    <Accordion
      $isOpen={open}
      $background={variants[variant].background}
      $borderColor={variants[variant].border}
    >
      <AccordionTrigger onClick={() => setOpen(!open)} isOpen={open}>
        {trigger}
      </AccordionTrigger>
      <AccordionContent $isOpen={open}>{children}</AccordionContent>
    </Accordion>
  )
}
