'use client'

import { styled } from 'styled-components'

import theme from '@/styles/theme'

interface ComboboxProps {
  $isSelected: boolean
}

export const Combobox = styled.a<ComboboxProps>`
  position: relative;
  width: 100%;

  .trigger {
    border-color: ${props =>
      props.$isSelected ? theme.colors.primary : theme.colors.gray20};
  }
`

export const Trigger = styled.button`
  display: flex;
  align-items: center;

  width: 100%;
  min-height: 60px;

  padding: 0 12px;

  background-color: ${theme.colors.gray15};
  border: 1px solid ${theme.colors.gray20};
  border-radius: 8px;

  color: ${theme.colors.text};

  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.gray35};
  }
`

interface ContentProps {
  $isOpen: boolean
}

export const Content = styled.div<ContentProps>`
  position: absolute;
  z-index: 1;
  overflow: hidden;
  top: 100%;

  display: ${props => (props.$isOpen ? 'block' : 'none')};
  width: 100%;

  margin-top: 4px;

  background-color: ${theme.colors.gray15};
  border: 1px solid ${theme.colors.gray35};
  border-radius: 8px;
`

export const Group = styled.div`
  > button {
    border-bottom: 1px solid ${theme.colors.gray25};

    &:first-child {
      border-radius: 8px 8px 0 0;
    }

    &:last-child {
      border-bottom: none;
      border-radius: 0 0 8px 8px;
    }
  }
`

export const Item = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 60px;

  padding: 0 12px;

  background-color: transparent;
  border: none;

  color: ${theme.colors.text};
  font-size: inherit;

  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.gray20};
  }

  &:focus-visible {
    outline: none;
    background-color: ${theme.colors.gray20};
  }
`
