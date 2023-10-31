'use client'

import { styled } from 'styled-components'

interface DotStatusProps {
  $color: string
}

export const DotStatus = styled.div<DotStatusProps>`
  min-width: 10px;
  width: 10px;
  min-height: 10px;
  height: 10px;

  background-color: ${props => props.$color};
  border-radius: 50%;
`
