'use client'

import theme from '@/styles/theme'
import { DotStatus } from './style'

interface ComponentProps {
  status: 'success' | 'warning' | 'error'
}

const variants = {
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.error
}

export default function Component(props: ComponentProps) {
  const { status = 'success' } = props

  return <DotStatus $color={variants[status]} />
}
