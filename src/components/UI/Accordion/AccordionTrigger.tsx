'use client'

import { useState, useEffect, ReactNode } from 'react'
import { AccordionTrigger } from './style'

interface ComponentProps {
  children: ReactNode
  onClick: () => void
  isOpen: boolean
}

export default function Component(props: ComponentProps) {
  const { children, onClick, isOpen } = props

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClick = () => {
    onClick()
  }

  return (
    <AccordionTrigger $isOpen={open} onClick={handleClick}>
      {children}
      {/* <Icon size="small">
        <FontAwesomeIcon icon={faChevronDown} />
      </Icon> */}
    </AccordionTrigger>
  )
}
