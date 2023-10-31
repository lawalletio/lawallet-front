'use client'

import { styled } from 'styled-components'

interface ModalProps {
  $isOpen?: boolean
}

export const Modal = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;

  display: ${props => (props.$isOpen ? 'block' : 'none')};
  width: 100%;
  height: 100%;

  &:before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    width: 100%;
    height: 100%;

    background-color: rgba(28, 28, 28, 0.9);
    backdrop-filter: blur(16px);
  }
`

export const ModalContent = styled.div`
  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;
`
