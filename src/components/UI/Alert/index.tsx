'use client'

import {
  AlertIcon,
  CheckIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'

import theme from '@/styles/theme'

import Icon from '../Icon'
import Text from '../Text'
import { Alert } from './style'

interface AlertProps {
  title: string | undefined
  description: string | undefined
  type: 'success' | 'warning' | 'error' | undefined
  isOpen: boolean
}

export default function Component(props: AlertProps) {
  const { title, description, type, isOpen = false } = props

  const isSuccess = type === 'success'

  return (
    <Alert
      $background={theme.colors[`${type}15`]}
      $color={type && theme.colors[type]}
      $isOpen={!!isOpen}
    >
      <div className="box">
        <Icon size="small">{isSuccess ? <CheckIcon /> : <AlertIcon />}</Icon>
        <div>
          {title && (
            <Text size="small" isBold>
              {title}
            </Text>
          )}
          {description && <Text size="small">{description}</Text>}
        </div>
        <div className="progress"></div>
      </div>
    </Alert>
  )
}
