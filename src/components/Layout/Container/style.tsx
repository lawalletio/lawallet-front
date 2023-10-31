'use client'

import { styled } from 'styled-components'

interface ContainerProps {
  $isSmall?: boolean
}

export const ContainerCustom = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  max-width: ${props => (props.$isSmall ? '450px' : '700px')};

  margin: 0 auto;
  padding: 0 0.8em;
`
