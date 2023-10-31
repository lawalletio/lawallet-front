'use client'

import { styled } from 'styled-components'

import theme from '@/styles/theme'

interface QRCodeProps {
  $isSmall: boolean
}

export const QRCode = styled.div<QRCodeProps>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  padding: ${props => (props.$isSmall ? '16px 0' : '32px 0')};

  background-color: ${theme.colors.white};
`
