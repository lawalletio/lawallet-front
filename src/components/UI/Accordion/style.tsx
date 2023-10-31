'use client'

import { styled } from 'styled-components'

import theme from '@/styles/theme'

interface AccordionProps {
  $isOpen: boolean
  $background: string
  $borderColor: string
}

export const Accordion = styled.div<AccordionProps>`
  width: 100%;

  background-color: ${props =>
    props.$isOpen ? theme.colors.gray15 : props.$background};
  border: 1px solid
    ${props => (props.$isOpen ? theme.colors.gray35 : props.$borderColor)};
  border-radius: 8px;

  &:hover {
    border-color: ${props =>
      props.$isOpen ? theme.colors.gray35 : theme.colors.gray25};
  }
`

interface AccordionContentProps {
  $isOpen: boolean
}

export const AccordionContent = styled.div<AccordionContentProps>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
`

export const AccordionItem = styled.div``

interface AccordionTriggerProps {
  $isOpen: boolean
}

export const AccordionTrigger = styled.button<AccordionTriggerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  height: 60px;

  padding: 0 16px;

  background-color: transparent;
  border: none;
  border-bottom: 1px solid
    ${props => (props.$isOpen ? theme.colors.gray20 : 'transparent')};

  color: ${theme.colors.text};
  font-size: initial;
  text-align: left;

  cursor: pointer;

  span {
    flex: 1;
  }

  svg {
    color: ${props =>
      props.$isOpen ? theme.colors.text : theme.colors.gray25};

    transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`

export const AccordionBody = styled.div`
  padding: 12px 16px;

  ul {
    li {
      padding: 12px 0;
      border-bottom: 1px solid ${theme.colors.gray20};

      &:last-child {
        border-bottom: none;
      }
    }
  }
`
