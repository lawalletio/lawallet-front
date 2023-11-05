import { useContext, useEffect, useState } from 'react'

import keys from '@/constants/keys'
const { ledgerPubkey } = keys

import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk'
import { TokenBalance } from '@/types/balance'
import { NDKContext } from '@/context/NDKContext'
import { useSubscription } from './useSubscription'

export interface UseTokenBalanceReturn {
  balance: TokenBalance
}

export interface UseTokenBalanceProps {
  pubkey: string
  tokenId: string
  closeOnEose?: boolean
}

export const useTokenBalance = ({
  pubkey,
  tokenId,
  closeOnEose = false
}: UseTokenBalanceProps): UseTokenBalanceReturn => {
  const { ndk } = useContext(NDKContext)
  const [balance, setBalance] = useState<TokenBalance>({
    tokenId: tokenId,
    amount: 0,
    loading: true
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
      groupable: false,
      closeOnEose
    },
    enabled: Boolean(!balance.loading)
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
        amount: event
          ? Number(event.getMatchingTags('amount')[0]?.[1]) / 1000
          : 0,
        loading: false,
        lastEvent: event ? (event as NostrEvent) : undefined,
        createdAt: event ? new Date(event.created_at!) : new Date()
      })
    }
  }

  useEffect(() => {
    loadBalance()

    setTimeout(() => {
      if (balance.loading)
        setBalance(prev => {
          return { ...prev, loading: false }
        })
    }, 2000)
  }, [])

  useEffect(() => {
    if (balanceEvents.length) {
      const latestEvent = balanceEvents.sort(
        (a, b) => b.created_at! - a.created_at!
      )[0]

      setBalance({
        tokenId: tokenId,
        amount: Number(latestEvent.getMatchingTags('amount')[0]?.[1]) / 1000,
        lastEvent: latestEvent as NostrEvent,
        createdAt: new Date(latestEvent.created_at!),
        loading: false
      })
    }
  }, [balanceEvents])

  return {
    balance
  }
}
