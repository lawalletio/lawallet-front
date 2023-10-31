import { useEffect, useState } from 'react'

import keys from '@/constants/keys'
const { ledgerPubkey } = keys

import { NDKKind, NostrEvent } from '@nostr-dev-kit/ndk'
import { TokenBalance } from '@/types/balance'
import { useSubscription } from './useSubscription'

export interface ActivitySubscriptionProps {
  pubkey: string
  tokenId: string
}

export interface UseTokenBalanceReturn {
  balance: TokenBalance
}

export interface UseTokenBalanceProps {
  pubkey: string
  tokenId: string
}

export interface ActivitySubscriptionProps {
  pubkey: string
}

export const useTokenBalance = ({
  pubkey,
  tokenId
}: UseTokenBalanceProps): UseTokenBalanceReturn => {
  const [balance, setBalance] = useState<TokenBalance>({
    tokenId: tokenId,
    amount: 0
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { events: balanceEvents } = useSubscription({
    filters: [
      {
        authors: [ledgerPubkey],
        kinds: [31111 as NDKKind],
        '#d': [`balance:${tokenId}:${pubkey}`]
      }
    ],
    options: {
      groupable: false
    },
    enabled: Boolean(pubkey.length)
  })

  useEffect(() => {
    if (balanceEvents.length) {
      const latestEvent = balanceEvents.sort(
        (a, b) => b.created_at! - a.created_at!
      )[0]

      setBalance({
        tokenId: tokenId,
        amount: Number(latestEvent.getMatchingTags('amount')[0]?.[1]) / 1000,
        lastEvent: latestEvent as NostrEvent,
        createdAt: new Date(latestEvent.created_at!)
      })
    }
  }, [balanceEvents])

  return {
    balance
  }
}
