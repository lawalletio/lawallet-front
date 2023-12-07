export const WALLET_DOMAIN: string = process.env.NEXT_PUBLIC_WALLET_DOMAIN ?? ''
export const LAWALLET_ENDPOINT: string =
  process.env.NEXT_PUBLIC_LAWALLET_API_ENDPOINT ?? ''
export const IDENTITY_ENDPOINT: string =
  process.env.NEXT_PUBLIC_IDENTITY_API_ENDPOINT ?? ''
export const GOOGLE_TAG_ID: string = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? ''

export const RelaysList = ['wss://relay.damus.io', 'wss://relay.lawallet.ar']
export const MAX_INVOICE_AMOUNT: number = 10 ** 7 // 10M

export const LaWalletPubkeys = {
  cardPubkey:
    '18f6a706091b421bd9db1ec964b4f934007fb6997c60e3c500fdaebe5f9f7b18',
  ledgerPubkey:
    'bd9b0b60d5cd2a9df282fc504e88334995e6fac8b148fa89e0f8c09e2a570a84',
  urlxPubkey: 'e17feb5f2cf83546bcf7fd9c8237b05275be958bd521543c2285ffc6c2d654b3'
}

//'wss://relay.snort.social',
//  'wss://nostr.bitcoiner.social',
//  'wss://nostr-pub.wellorder.net',
//  'wss://relay.primal.net',
//  'wss://nostr-01.bolt.observer',
