import { useContext, useEffect, useState } from 'react'

import keys from '@/constants/keys'
const { ledgerPubkey } = keys

import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk'
import { TokenBalance } from '@/types/balance'
import { NDKContext } from '@/context/NDKContext'

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
  const { ndk } = useContext(NDKContext)
  const [balance, setBalance] = useState<TokenBalance>({
    tokenId: tokenId,
    amount: 0,
    loading: true
  })

  const loadBalance = async () => {
    const event: NDKEvent | null = await ndk.fetchEvent({
      authors: [ledgerPubkey],
      kinds: [31111 as NDKKind],
      '#d': [`balance:${tokenId}:${pubkey}`]
    })

    if (event) {
      setBalance({
        tokenId: tokenId,
        amount: Number(event.getMatchingTags('amount')[0]?.[1]) / 1000,
        loading: false,
        lastEvent: event as NostrEvent,
        createdAt: new Date(event.created_at!)
      })
    } else {
      setBalance({
        ...balance,
        loading: false
      })
    }
  }

  useEffect(() => {
    loadBalance()
  }, [])

  return {
    balance
  }
}
