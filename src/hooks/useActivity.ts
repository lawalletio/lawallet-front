import {
  Transaction,
  TransactionDirection,
  TransactionStatus,
  TransactionType
} from '@/types/transaction'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { NDKEvent, NDKKind, NDKSubscriptionOptions } from '@nostr-dev-kit/ndk'

import { useSubscription } from './useSubscription'
import keys from '@/constants/keys'
import { getMultipleTags, getTag } from '@/lib/events'

export interface ActivitySubscriptionProps {
  pubkey: string
}

export type ActivityType = {
  loading: boolean
  lastCached: number
  cached: Transaction[]
  previous: Transaction[]
  suscription: Transaction[]
}

export interface UseActivityReturn {
  activityInfo: ActivityType
  sortedTransactions: Transaction[]
}

export interface UseActivityProps {
  pubkey: string
  enabled: boolean
  limit?: number
}

export const options: NDKSubscriptionOptions = {
  groupable: false,
  closeOnEose: false
}

const startTags: string[] = [
  'internal-transaction-start',
  'inbound-transaction-start'
]

const statusTags: string[] = [
  'internal-transaction-ok',
  'internal-transaction-error',
  'outbound-transaction-ok',
  'outbound-transaction-error',
  'inbound-transaction-ok',
  'inbound-transaction-error'
]

let intervalGenerateTransactions: NodeJS.Timeout

const parseContent = (content: string) => {
  try {
    const parsed = JSON.parse(content)
    return parsed
  } catch {
    return {}
  }
}

export const useActivity = ({
  pubkey,
  enabled,
  limit = 100
}: UseActivityProps): UseActivityReturn => {
  const [activityInfo, setActivityInfo] = useState<ActivityType>({
    loading: true,
    lastCached: 0,
    previous: [],
    cached: [],
    suscription: []
  })

  const { events: walletEvents } = useSubscription({
    filters: [
      {
        authors: [pubkey],
        kinds: [1112 as NDKKind],
        '#t': ['internal-transaction-start'],
        since: activityInfo.lastCached,
        limit
      },
      {
        '#p': [pubkey],
        '#t': startTags,
        kinds: [1112 as NDKKind],
        since: activityInfo.lastCached,
        limit
      },
      {
        authors: [keys.ledgerPubkey],
        kinds: [1112 as NDKKind],
        '#p': [pubkey],
        '#t': statusTags,
        since: activityInfo.lastCached,
        limit
      }
    ],
    options,
    enabled: enabled && !activityInfo.loading
  })

  const formatStartTransaction = async (event: NDKEvent) => {
    const AuthorIsUser: boolean = event.pubkey === pubkey
    const boltTag: string = getTag(event.tags, 'bolt11')

    const direction = AuthorIsUser
      ? TransactionDirection.OUTGOING
      : TransactionDirection.INCOMING

    const eventContent = parseContent(event.content)

    const newTransaction: Transaction = {
      id: event.id!,
      status: TransactionStatus.PENDING,
      memo: eventContent,
      direction,
      type: boltTag.length ? TransactionType.LN : TransactionType.INTERNAL,
      tokens: eventContent.tokens,
      events: [await event.toNostrEvent()],
      errors: [],
      createdAt: event.created_at! * 1000
    }

    return newTransaction
  }

  const markTxRefund = async (
    transaction: Transaction,
    statusEvent: NDKEvent
  ) => {
    const parsedContent = parseContent(statusEvent.content)
    transaction.status = TransactionStatus.REVERTED
    transaction.errors = [parsedContent?.memo]
    transaction.events.push(await statusEvent.toNostrEvent())

    return transaction
  }

  const updateTxStatus = async (
    transaction: Transaction,
    statusEvent: NDKEvent
  ) => {
    const parsedContent = parseContent(statusEvent.content)

    const statusTag: string = getTag(statusEvent.tags, 't')
    const isError: boolean = statusTag.includes('error')

    if (
      transaction.direction === TransactionDirection.INCOMING &&
      statusTag.includes('inbound')
    )
      transaction.type = TransactionType.LN

    transaction.status = isError
      ? TransactionStatus.ERROR
      : TransactionStatus.CONFIRMED

    if (isError) transaction.errors = [parsedContent]
    transaction.events.push(await statusEvent.toNostrEvent())
    return transaction
  }

  const findAsocciatedEvent = useCallback(
    (events: NDKEvent[], eventId: string) => {
      return events.find(event => {
        const associatedEvents: string[] = getMultipleTags(event.tags, 'e')
        if (associatedEvents.includes(eventId)) return event
      })
    },
    []
  )

  const filterEventsByTxType = (events: NDKEvent[]) => {
    const startedEvents: NDKEvent[] = [],
      statusEvents: NDKEvent[] = [],
      refundEvents: NDKEvent[] = []

    events.forEach(e => {
      const subkind: string = getTag(e.tags, 't')
      const isStatusEvent: boolean = statusTags.includes(subkind)

      if (isStatusEvent) {
        statusEvents.push(e)
        return
      } else {
        const eTags: string[] = getMultipleTags(e.tags, 'e')

        if (eTags.length) {
          const isRefundEvent = events.find(event => eTags.includes(event.id))
          isRefundEvent ? refundEvents.push(e) : startedEvents.push(e)
          return
        } else {
          startedEvents.push(e)
          return
        }
      }
    })

    return [startedEvents, statusEvents, refundEvents]
  }

  async function generateTransactions(events: NDKEvent[]) {
    const userTransactions: Transaction[] = []
    const [startedEvents, statusEvents, refundEvents] =
      filterEventsByTxType(events)

    setActivityInfo(prev => {
      return {
        ...prev,
        previous: sortedTransactions,
        loading: true
      }
    })

    startedEvents.forEach(startEvent => {
      formatStartTransaction(startEvent)
        .then(formattedTx => {
          const statusEvent: NDKEvent | undefined = findAsocciatedEvent(
            statusEvents,
            startEvent.id!
          )

          if (!statusEvent) return formattedTx
          return updateTxStatus(formattedTx, statusEvent)
        })
        .then(formattedTx => {
          const refundEvent: NDKEvent | undefined = findAsocciatedEvent(
            refundEvents,
            startEvent.id!
          )

          if (!refundEvent) return formattedTx

          const statusRefundEvent: NDKEvent | undefined = findAsocciatedEvent(
            refundEvents,
            refundEvent.id!
          )
          return markTxRefund(formattedTx, statusRefundEvent || refundEvent)
        })
        .then((transaction: Transaction) => {
          userTransactions.push(transaction)
        })
    })

    setActivityInfo(prev => {
      return {
        ...prev,
        suscription: userTransactions,
        loading: false
      }
    })
  }

  useEffect(() => {
    if (walletEvents.length) {
      if (intervalGenerateTransactions)
        clearTimeout(intervalGenerateTransactions)

      intervalGenerateTransactions = setTimeout(
        () => generateTransactions(walletEvents),
        350
      )
    }

    return () => clearTimeout(intervalGenerateTransactions)
  }, [walletEvents])

  const loadCachedTransactions = () => {
    const storagedData: string = localStorage.getItem(`cached_txs`) || ''
    if (!storagedData) {
      setActivityInfo({
        ...activityInfo,
        loading: false
      })
      return
    }

    const cachedTxs: Transaction[] = JSON.parse(storagedData)
    setActivityInfo({
      suscription: [],
      previous: cachedTxs,
      cached: cachedTxs,
      lastCached: cachedTxs.length ? 1 + cachedTxs[0].createdAt / 1000 : 0,
      loading: false
    })
  }

  useEffect(() => {
    loadCachedTransactions()
  }, [])

  const sortedTransactions: Transaction[] = useMemo(() => {
    const TXsWithoutCached: Transaction[] = activityInfo.suscription.filter(
      tx => {
        const cached = activityInfo.cached.find(
          cachedTX => cachedTX.id === tx.id
        )

        return Boolean(!cached)
      }
    )

    return [...TXsWithoutCached, ...activityInfo.cached].sort(
      (a, b) => b.createdAt - a.createdAt
    )
  }, [activityInfo])

  useEffect(() => {
    if (sortedTransactions.length)
      localStorage.setItem('cached_txs', JSON.stringify(sortedTransactions))
  }, [sortedTransactions])

  return {
    activityInfo,
    sortedTransactions
  }
}
