import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'

import GlobalStyles from '../src/styles/GlobalStyles'

import DocTemplate from './DocTemplate.mdx'
import theme from '../src/styles/theme'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: themes.dark,
      page: DocTemplate,
      toc: true
    }
  }
}

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      dark: theme
    },
    defaultTheme: 'dark',
    Provider: ThemeProvider,
    GlobalStyles
  })
]

export default preview
