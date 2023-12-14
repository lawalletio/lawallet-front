'use client'

import { useContext, useState } from 'react'
import ReactQRCode from 'react-qr-code'

import { LaWalletContext } from '@/context/LaWalletContext'

import { copy } from '@/lib/share'

import Text from '../Text'

import theme from '@/styles/theme'
import { QRCode, Toast } from './style'
import { useTranslation } from '@/context/TranslateContext'

interface ComponentProps {
  value: string
  size?: number
  borderSize?: number
  showCopy?: boolean
  textToCopy?: string
}

export default function Component({
  value,
  size = 150,
  borderSize = 40,
  showCopy = true,
  textToCopy
}: ComponentProps) {
  const [showToast, setShowToast] = useState(true)
  const { notifications } = useContext(LaWalletContext)
  const { t } = useTranslation()

  const handleCopy = (text: string) => {
    copy(text).then(res => {
      setShowToast(false)
      notifications.showAlert({
        description: res ? 'SUCCESS_COPY' : 'ERROR_COPY',
        type: res ? 'success' : 'error'
      })
    })
  }

  return (
    <QRCode
      size={size + borderSize}
      onClick={() => {
        if (showCopy) handleCopy(textToCopy ? textToCopy : value)
      }}
    >
      {showCopy ? (
        <Toast $isShow={showToast}>
          <Text size="small">{t('PRESS_TO_COPY')}</Text>
          <span></span>
        </Toast>
      ) : null}

      <ReactQRCode
        value={value}
        size={size}
        fgColor={theme.colors.black}
        bgColor={theme.colors.white}
      />
    </QRCode>
  )
}
