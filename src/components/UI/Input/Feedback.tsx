'use client'

import { ReactNode } from 'react'
import Text from '../Text'
import { Feedback } from './style'

interface FeedbackProps {
  children: ReactNode
  status?: null | 'success' | 'error'
  show?: boolean
}

export default function Component(props: FeedbackProps) {
  const { children, status, show = false } = props

  return (
    <Feedback $isShow={show} $isSuccess={status === 'success'}>
      <Text size="small" align="right">
        {children}
      </Text>
    </Feedback>
  )
}
