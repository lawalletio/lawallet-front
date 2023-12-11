import { create } from '@storybook/theming/create'

export default create({
  base: 'dark',
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'LaWallet Storybook',
  brandUrl: 'https://lawallet.ar/',
  brandImage: 'https://i.imgur.com/QeUh8rC.png',
  brandTarget: '_self',

  // BRAND
  colorPrimary: '#FDC800',
  colorSecondary: '#56B68C',

  // UI
  appBg: '#262626',
  appContentBg: '#1C1C1C',
  appPreviewBg: '#1C1C1C'
})
