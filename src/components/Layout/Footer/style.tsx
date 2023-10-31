'use client'

import { styled } from 'styled-components'

interface FooterProps {}

export const Footer = styled.div<FooterProps>`
  position: fixed;
  bottom: 0;

  width: 100%;

  background-color: rgba(28, 28, 28, 0.65);
  backdrop-filter: blur(4px);
`
