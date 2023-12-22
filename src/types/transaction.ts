import { NostrEvent } from '@nostr-dev-kit/ndk'

// type StrObjectType = Record<string, string>

export interface Transaction {
  id: string
  status: TransactionStatus
  direction: TransactionDirection
  type: TransactionType
  tokens: TokensAmount
  memo: string
  errors: string[]
  events: NostrEvent[]
  createdAt: number
}

export enum TransferTypes {
  INTERNAL = 'INTERNAL',
  LUD16 = 'LUD16',
  INVOICE = 'INVOICE',
  LNURL = 'LNURL',
  LNURLW = 'LNURLW'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ERROR = 'ERROR',
  REVERTED = 'REVERTED'
}

export enum TransactionDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING'
}

export enum TransactionType {
  CARD = 'CARD',
  INTERNAL = 'INTERNAL',
  LN = 'LN'
}

export type TokensAmount = {
  [_tokenId: string]: number
}
