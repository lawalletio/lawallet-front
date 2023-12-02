import theme from '@/styles/theme'
import styled from 'styled-components'

interface CardProp {
  $isActive: boolean
}

export const Card = styled.div<CardProp>`
  width: 280px;
  height: 176px;

  border-radius: 12px;
  background-color: ${props =>
    props.$isActive ? theme.colors.primary : theme.colors.gray25};
`
