import { styled } from 'styled-components'

export const Default = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  button {
    width: 65px !important;
    height: 65px !important;

    svg {
      width: 32px !important;
      height: 32px !important;
    }
  }
`
