'use client'

import { styled } from 'styled-components'

export const HeadingBox = styled.div`
  h1 {
    font-size: 1.6em;
    line-height: 1.1em;

    @media (min-width: 800px) {
      font-size: 2.1em;
      line-height: 1em;
    }
  }

  h2 {
    font-size: 1.3em;
    line-height: 1.6em;

    @media (min-width: 800px) {
      font-size: 1.6em;
      line-height: 1.9em;
    }
  }

  h3 {
    font-size: 1.1em;
    line-height: 1.4em;

    @media (min-width: 800px) {
      font-size: 1.3em;
      line-height: 1.7em;
    }
  }

  h4 {
    font-size: 1em;
    line-height: 1.3em;
  }

  h5 {
    font-size: 0.9em;
    line-height: 1.2em;
  }

  h6 {
    font-size: 0.8em;
    line-height: 1.1em;
  }
`

interface HeadingProps {
  $align: 'left' | 'center' | 'right'
  $color?: string
}

export const HeadingCustom = styled.div<HeadingProps>`
  color: ${props => props.$color};
  text-align: ${props => props.$align};
`
