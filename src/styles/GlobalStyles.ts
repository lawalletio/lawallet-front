'use client'

import { createGlobalStyle } from 'styled-components'

import theme from './theme'

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    
    margin: 0;
    padding: 0;
  }

  html {
    overflow-x: hidden;

    font-size: 20px;
  }

  body {
    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    min-width: 100vw;
    min-height: 100dvh;

    background: ${theme.colors.background};

    color: ${theme.colors.text};
    font-size: 1em;
    font-weight: 400;
    font-family: 'SF Pro Text';
  }

  ul {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  a, 
  button {
    font-family: 'SF Pro Text';
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'IAAB3-Mono';
  }
`

export default GlobalStyles
