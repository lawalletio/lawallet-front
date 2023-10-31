'use client'

import ReactQRCode from 'react-qr-code'

import theme from '@/styles/theme'
import { QRCode } from './style'

interface ComponentProps {
  value: string
  size?: number
}

export default function Component({ value, size = 250 }: ComponentProps) {
  return (
    <QRCode $isSmall={false}>
      <ReactQRCode
        value={value}
        size={size}
        fgColor={theme.colors.black}
        bgColor={theme.colors.white}
      />
    </QRCode>
  )
}
