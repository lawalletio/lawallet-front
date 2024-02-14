import { styled } from 'styled-components'

import { ActionSheetPrimitiveProps } from './types'

import theme from '@/styles/theme'

export const ActionSheetPrimitive = styled.div<ActionSheetPrimitiveProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;

  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  padding: 0 16px;

  &:before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    width: 100%;
    height: 100%;

    background-color: rgba(28, 28, 28, 0.95);
    backdrop-filter: blur(16px);
  }
`

export const ActionSheetContent = styled.div`
  position: relative;
  overflow: hidden;
  z-index: 2;

  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  padding: 12px;

  background-color: ${theme.colors.gray15};
  border-radius: 16px;

  button,
  a {
    border-radius: 8px;
    border-top: 1px solid ${theme.colors.gray20};
  }
`

export const ActionSheetHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  margin: 4px 24px 12px 24px;
`

export const ActionSheetWrapper = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media screen and (min-width: 1023px) {
    max-width: 320px;
  }
`
