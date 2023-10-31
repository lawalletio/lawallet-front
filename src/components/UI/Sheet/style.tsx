'use client'

import { styled } from 'styled-components'

import theme from '@/styles/theme'

interface SheetProps {
  $isOpen?: boolean
}

export const Sheet = styled.div<SheetProps>`
  position: fixed;
  overflow-x: hidden;
  bottom: 0;
  left: 0;
  z-index: 3;

  width: 100%;
  height: 100%;

  background-color: ${props =>
    props.$isOpen ? theme.colors.black : 'transparent'};

  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(100%)')};
  transition-duration: 0.2s;
  transform: ${props => (props.$isOpen ? 1 : 0)};
`

interface SheetContentProps {
  $isOpen?: boolean
}

export const SheetContent = styled.div<SheetContentProps>`
  position: relative;
  z-index: 2;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100dvh - 60px);

  margin-top: 60px;
  padding-top: 24px;

  background-color: ${theme.colors.gray15};
  border-radius: 24px 24px 0 0;

  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(100%)')};
  transition-duration: 0.4s;
`
