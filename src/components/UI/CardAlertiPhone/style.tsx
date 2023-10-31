import { styled } from 'styled-components'

import theme from '@/styles/theme'

export const CardAlertiPhone = styled.div`
  position: relative;
  overflow: hidden;

  width: 100%;

  padding: 16px;

  background-color: ${theme.colors.white};
  border-radius: 24px;

  color: ${theme.colors.black};

  > div {
    &:first-child {
      max-width: 200px;

      @media screen and (min-width: 700px) {
        max-width: 300px;
      }
    }

    &:last-child {
      position: absolute;
      top: 0;
      right: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100%;

      svg {
        width: 50px;
      }
    }
  }
`
