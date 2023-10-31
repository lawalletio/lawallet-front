import { NostrEvent } from '@nostr-dev-kit/ndk'

export interface TokenBalance {
  tokenId: string
  amount: number
  loading: boolean
  lastEvent?: NostrEvent
  createdAt?: Date
}
