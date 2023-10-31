'use client'

import { styled } from 'styled-components'

import theme from '@/styles/theme'

interface AvatarProps {
  $isNormal: boolean
}

export const Avatar = styled.div<AvatarProps>`
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${props => (props.$isNormal ? '35px' : '45px')};
  min-height: ${props => (props.$isNormal ? '35px' : '45px')};
  max-width: ${props => (props.$isNormal ? '35px' : '45px')};
  max-height: ${props => (props.$isNormal ? '35px' : '45px')};

  background-color: ${theme.colors.gray20};
  border: 1px solid ${theme.colors.gray30};
  border-radius: 50%;
`

export const AvatarImage = styled.img`
  width: 100%;
  height: auto;
`
