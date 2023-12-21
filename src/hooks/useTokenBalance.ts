import { useContext, useEffect, useState } from 'react'

import { NDKEvent, NDKKind, NostrEvent } from '@nostr-dev-kit/ndk'
import { TokenBalance } from '@/types/balance'
import { NDKContext } from '@/context/NDKContext'
import { useSubscription } from './useSubscription'
import { LaWalletKinds } from '@/lib/events'
import config from '@/constants/config'

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
  const { subscription: balanceSubscription } = useSubscription({
    filters: [
      {
        authors: [config.pubKeys.ledgerPubkey],
        kinds: [LaWalletKinds.PARAMETRIZED_REPLACEABLE as unknown as NDKKind],
        '#d': [`balance:${tokenId}:${pubkey}`]
      }
    ],
    options: {
      groupable: false,
      closeOnEose
    },
    enabled: !balance.loading && Boolean(pubkey.length)
  })

  const loadBalance = async () => {
    setBalance({
      ...balance,
      loading: true
    })

    const event: NDKEvent | null = await ndk.fetchEvent({
      authors: [config.pubKeys.ledgerPubkey],
      kinds: [LaWalletKinds.PARAMETRIZED_REPLACEABLE as unknown as NDKKind],
      '#d': [`balance:${tokenId}:${pubkey}`]
    })

    if (event)
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

  useEffect(() => {
    if (!pubkey.length) {
      setBalance({
        tokenId: tokenId,
        amount: 0,
        loading: true
      })
    } else {
      loadBalance()

      setTimeout(() => {
        if (balance.loading)
          setBalance(prev => {
            return { ...prev, loading: false }
          })
      }, 2000)
    }
  }, [pubkey])

  useEffect(() => {
    balanceSubscription?.on('event', event => {
      setBalance({
        tokenId: tokenId,
        amount: Number(event.getMatchingTags('amount')[0]?.[1]) / 1000,
        lastEvent: event as NostrEvent,
        createdAt: new Date(event.created_at!),
        loading: false
      })
    })
  }, [balanceSubscription])

  return {
    balance
  }
}
