import { styled } from 'styled-components'

import theme from '@/styles/theme'

export const ToggleSwitch = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  input[type='checkbox'] {
    visibility: hidden;

    height: 0;
    width: 0;
  }

  label {
    position: relative;

    display: block;
    min-width: 44px;
    height: 24px;

    background: ${theme.colors.gray30};
    border-radius: 100px;

    text-indent: -9999px;

    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;

      width: 20px;
      height: 20px;

      background: ${theme.colors.white};
      border-radius: 90px;

      transition: 0.3s;
    }

    &:active::after {
      width: 20px;
    }
  }

  input:checked + label {
    background: ${theme.colors.primary};
  }

  input:checked + label:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`
