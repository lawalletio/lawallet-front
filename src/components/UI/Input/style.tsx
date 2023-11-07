'use client'

import { styled } from 'styled-components'
import theme from '@/styles/theme'

interface InputCustomProps {
  $isSuccess?: boolean
  $showValidate?: boolean
}

export const Input = styled.input<InputCustomProps>`
  flex: 1;
  min-height: 50px;
  width: 100%;
  /* min-width: 200px; */

  padding: 8px;
  padding-left: 12px;

  background-color: ${theme.colors.gray15};
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.$showValidate
        ? theme.colors.gray20
        : props.$isSuccess
        ? theme.colors.success
        : theme.colors.error};

  color: ${theme.colors.text};
  font-size: 0.8em;

  outline: none;

  transition-duration: 0.3s;

  &::placeholder {
    color: ${theme.colors.gray30};
  }

  &:not(:disabled) {
    &:hover {
      border-color: ${theme.colors.gray30};
    }

    &:focus-visible {
      border-color: ${theme.colors.primary};
    }

    &:active {
      border-color: ${theme.colors.primary};
    }
  }

  &:disabled {
    opacity: 0.35;

    cursor: not-allowed;
  }
`

export const InputButton = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  padding-right: 10px;
`

export const InputGroup = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;

  input {
    border-radius: 8px 0 0 8px !important;
  }
`

export const InputGroupRight = styled.div`
  display: flex;
  align-items: center;
  min-height: 50px;

  padding: 0 12px;

  background-color: ${theme.colors.gray10};
  border: 1px solid ${theme.colors.gray20};
  border-left: 0;
  border-radius: 0 8px 8px 0;
`

interface FeedbackProps {
  $isShow: boolean
  $isSuccess: boolean
}

export const Feedback = styled.div<FeedbackProps>`
  opacity: ${props => (props.$isShow ? 1 : 0)};

  display: block;

  margin-top: 4px;

  color: ${props =>
    props.$isSuccess ? theme.colors.success : theme.colors.error};

  /* font-size: 0.7em; */
`

export const InputWithLabel = styled.div``

interface InputBoxProps {
  $withIcon: boolean
}

export const InputBox = styled.div<InputBoxProps>`
  position: relative;

  width: 100%;

  input {
    padding-right: ${props => (props.$withIcon ? '60px' : '8px')};
  }
`

export const InputIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;

  span,
  svg {
    width: 18px;
    height: 18px;
  }
`

export const Textarea = styled.textarea<InputCustomProps>`
  width: 100%;

  padding: 8px;
  padding-left: 12px;

  background-color: ${theme.colors.gray15};
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.$showValidate
        ? theme.colors.gray20
        : props.$isSuccess
        ? theme.colors.success
        : theme.colors.error};

  color: ${theme.colors.text};
  font-size: 0.8em;

  outline: none;
  resize: none;

  transition-duration: 0.3s;

  &::placeholder {
    color: ${theme.colors.gray30};
  }

  &:hover {
    border-color: ${theme.colors.gray30};
  }

  &:active {
    border-color: ${theme.colors.primary};
  }

  &:focus-visible {
    border-color: ${theme.colors.primary};
  }
`
export const Pin = styled.div`
  width: 100%;

  .vi__wrapper {
    width: 100%;
  }

  .vi__container {
    width: 100%;
  }

  .vi__character {
    width: 100%;
    max-width: 40px;

    background-color: ${theme.colors.gray15};
    border-radius: 8px;
    border: 1px solid ${theme.colors.gray20};

    font-size: initial;
    color: ${theme.colors.text};
    font-size: 0.8em;

    &.vi__character--inactive {
      opacity: 0.35;

      cursor: not-allowed;
    }
  }
`
