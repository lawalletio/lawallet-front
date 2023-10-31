'use client'

import { useState, useEffect, ReactNode } from 'react'

import Container from '../../Layout/Container'

import Flex from '../Flex'
import Divider from '../Divider'
import Button from '../Button'
import Heading from '../Heading'

import { Sheet, SheetContent } from './style'
import { useTranslation } from '@/hooks/useTranslations'

interface ComponentProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function Component(props: ComponentProps) {
  const { children, isOpen, onClose, title } = props
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Sheet $isOpen={open}>
      <SheetContent $isOpen={open}>
        <Flex>
          <Container>
            <Flex align="center" justify="space-between">
              <Heading as="h6">{title}</Heading>
              <Button variant="borderless" size="small" onClick={handleClose}>
                {t('CLOSE')}
              </Button>
            </Flex>
          </Container>
        </Flex>
        <Divider y={24} />
        <Flex direction="column" flex={1}>
          {children}
        </Flex>
        <Divider y={24} />
      </SheetContent>
    </Sheet>
  )
}
