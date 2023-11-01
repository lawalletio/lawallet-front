export const WALLET_DOMAIN: string = process.env.NEXT_PUBLIC_WALLET_DOMAIN ?? ''
export const LAWALLET_ENDPOINT: string =
  process.env.NEXT_PUBLIC_LAWALLET_API_ENDPOINT ?? ''
export const IDENTITY_ENDPOINT: string =
  process.env.NEXT_PUBLIC_IDENTITY_API_ENDPOINT ?? ''
export const GOOGLE_TAG_ID: string = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? ''

export const RelaysList = ['wss://relay.damus.io', 'wss://relay.lawallet.ar']

export const MAX_INVOICE_AMOUNT: number = 10 ** 7 // 10M

//'wss://relay.snort.social',
//  'wss://nostr.bitcoiner.social',
//  'wss://nostr-pub.wellorder.net',
//  'wss://relay.primal.net',
//  'wss://nostr-01.bolt.observer',
