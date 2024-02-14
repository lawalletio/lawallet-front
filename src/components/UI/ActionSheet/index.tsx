import { useState, useEffect } from 'react'

import Flex from '../Flex'
import Button from '../Button'
import Text from '../Text'

import { ActionSheetProps } from './types'

import {
  ActionSheetPrimitive,
  ActionSheetContent,
  ActionSheetWrapper,
  ActionSheetHeader
} from './style'

export default function ActionSheet(props: ActionSheetProps) {
  const { children, isOpen, onClose, title, description } = props

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <ActionSheetPrimitive $isOpen={open}>
      <ActionSheetWrapper>
        <ActionSheetContent>
          <ActionSheetHeader>
            {title && (
              <Text isBold align="center">
                {title}
              </Text>
            )}
            {description && (
              <Text size="small" align="center">
                {description}
              </Text>
            )}
          </ActionSheetHeader>
          {children}
        </ActionSheetContent>
        <Flex>
          <Button variant="bezeledGray" onClick={handleClose}>
            Cancelar
          </Button>
        </Flex>
      </ActionSheetWrapper>
    </ActionSheetPrimitive>
  )
}
