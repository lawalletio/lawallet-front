'use client'

import { useState, useEffect, ReactNode } from 'react'

import Container from '../../Layout/Container'

import Flex from '../Flex'
import Divider from '../Divider'
import Button from '../Button'

import { Modal as Default, ModalContent } from './style'

interface ComponentProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Modal(props: ComponentProps) {
  const { children, isOpen, onClose } = props

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Default $isOpen={open}>
      <ModalContent>
        <Container size="small">
          <Divider y={16} />
          <Flex direction="column" flex={1}>
            {children}
          </Flex>

          <Flex>
            <Button variant="bezeledGray" onClick={handleClose}>
              Cancelar
            </Button>
          </Flex>
          <Divider y={16} />
        </Container>
      </ModalContent>
    </Default>
  )
}
