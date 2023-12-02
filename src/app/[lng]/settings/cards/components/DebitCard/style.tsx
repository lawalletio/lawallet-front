import theme from '@/styles/theme'
import styled from 'styled-components'

interface CardImageProp {
  $isActive: boolean
}

export const CardImage = styled.div<CardImageProp>`
  display: flex;

  border-radius: 12px;
  box-shadow: ${props =>
    props.$isActive ? `0 18px 30px 0 ${theme.colors.primary}33}` : 'none'};
`

export const ConfigCard = styled.div<CardImageProp>`
  opacity: ${props => (props.$isActive ? '1' : 0)};
  width: ${props => (props.$isActive ? 'auto' : 0)};
`
