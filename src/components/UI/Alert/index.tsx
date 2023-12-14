'use client'

import {
  CheckIcon,
  AlertIcon
} from '@bitcoin-design/bitcoin-icons-react/filled'

import theme from '@/styles/theme'

import Text from '../Text'
import Icon from '../Icon'

import { Alert } from './style'
import { ReplacementParams, useTranslation } from '@/context/TranslateContext'

interface AlertProps {
  title: string | undefined
  description: string | undefined
  type: 'success' | 'warning' | 'error' | undefined
  isOpen: boolean
  params?: ReplacementParams
}

export default function Component(props: AlertProps) {
  const { title, description, type, isOpen = false, params = {} } = props
  const { t } = useTranslation()

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
              {t(title, params)}
            </Text>
          )}
          {description && <Text size="small">{t(description, params)}</Text>}
        </div>
        <div className="progress"></div>
      </div>
    </Alert>
  )
}
