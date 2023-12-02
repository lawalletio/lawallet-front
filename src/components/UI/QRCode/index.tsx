'use client'

import { useContext, useMemo, useState } from 'react'
import ReactQRCode from 'react-qr-code'

import { WALLET_DOMAIN } from '@/constants/config'

import { LaWalletContext } from '@/context/LaWalletContext'

import { copy } from '@/lib/share'
import lnurl from '@/lib/lnurl'

import Text from '../Text'

import theme from '@/styles/theme'
import { QRCode, Toast } from './style'

interface ComponentProps {
  value: string
}

export default function Component({ value }: ComponentProps) {
  const [showToast, setShowToast] = useState(true)

  const { identity, notifications } = useContext(LaWalletContext)

  const handleCopy = (text: string) => {
    copy(text).then(res => {
      setShowToast(false)
      notifications.showAlert({
        description: res ? 'SUCCESS_COPY' : 'ERROR_COPY',
        type: res ? 'success' : 'error'
      })
    })
  }

  const LNURLEncoded: string = useMemo(
    () =>
      lnurl
        .encode(
          `https://${WALLET_DOMAIN}/.well-known/lnurlp/${
            identity.username ? identity.username : identity.npub
          }`
        )
        .toUpperCase(),
    [identity]
  )

  return (
    <QRCode
      onClick={() =>
        handleCopy(
          identity.username
            ? `${identity.username}@${WALLET_DOMAIN}`
            : LNURLEncoded
        )
      }
    >
      <Toast $isShow={showToast}>
        <Text size="small">Presioname para copiar!</Text>
        <span></span>
      </Toast>

      <ReactQRCode
        value={value}
        size={150}
        fgColor={theme.colors.black}
        bgColor={theme.colors.white}
      />
    </QRCode>
  )
}
