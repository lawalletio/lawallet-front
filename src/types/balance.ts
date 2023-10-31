import { NostrEvent } from '@nostr-dev-kit/ndk'

export interface TokenBalance {
  tokenId: string
  amount: number
  lastEvent?: NostrEvent
  createdAt?: Date
}
