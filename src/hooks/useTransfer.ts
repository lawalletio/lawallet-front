import keys from '@/constants/keys'
import {
  TransferInformation,
  broadcastTransaction,
  defaultTransfer,
  requestInvoice
} from '@/interceptors/transaction'
import { generateTxStart, getTag } from '@/lib/events'
import { formatTransferData } from '@/lib/utils'
import { TransferTypes } from '@/types/transaction'
import {
  NDKEvent,
  NDKKind,
  NDKPrivateKeySigner,
  NDKTag,
  NostrEvent
} from '@nostr-dev-kit/ndk'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { useSubscription } from './useSubscription'
import { NDKContext } from '@/context/NDKContext'

export interface TransferContextType {
  loading: boolean
  transferInfo: TransferInformation
  prepareTransaction: (data: string) => Promise<boolean>
  setAmountToPay: (amount: number) => void
  executeTransfer: (signer: NDKPrivateKeySigner) => void
}

const useTransfer = (): TransferContextType => {
  const [loading, setLoading] = useState<boolean>(false)
  const [startEvent, setStartEvent] = useState<NostrEvent | null>(null)
  const [transferInfo, setTransferInfo] =
    useState<TransferInformation>(defaultTransfer)

  const { ndk } = useContext(NDKContext)

  const router = useRouter()
  const params = useSearchParams()

  const { events } = useSubscription({
    filters: [
      {
        authors: [keys.ledgerPubkey],
        kinds: [1112 as NDKKind],
        since: startEvent ? startEvent.created_at - 60000 : undefined,
        '#e': startEvent?.id ? [startEvent.id] : []
      }
    ],
    options: {},
    enabled: Boolean(startEvent?.id)
  })

  const prepareTransaction = async (data: string) => {
    const formattedTransferInfo: TransferInformation =
      await formatTransferData(data)

    switch (formattedTransferInfo.type) {
      case false:
        return false

      case TransferTypes.INVOICE:
        router.push(`/transfer/summary?data=${formattedTransferInfo.data}`)
        break

      default:
        !formattedTransferInfo.amount
          ? router.push(`/transfer/amount?data=${formattedTransferInfo.data}`)
          : router.push(`/transfer/summary?data=${formattedTransferInfo.data}`)
    }

    setTransferInfo(formattedTransferInfo)
    return true
  }

  const setAmountToPay = (amount: number) => {
    setTransferInfo({
      ...transferInfo,
      amount
    })
  }

  const publishTransfer = (event: NostrEvent) => {
    setStartEvent(event)
    broadcastTransaction(event).then(published => {
      if (!published) router.push('/transfer/error')
    })
  }

  const executeTransfer = async (signer: NDKPrivateKeySigner) => {
    if (loading || !transferInfo.type || transferInfo.expired) return
    setLoading(true)

    try {
      if (transferInfo.type === TransferTypes.INTERNAL) {
        const txEvent: NostrEvent = await generateTxStart(
          transferInfo.amount * 1000,
          transferInfo.receiverPubkey,
          signer,
          []
        )

        publishTransfer(txEvent)
      } else {
        const bolt11: string = transferInfo.walletService
          ? await requestInvoice(
              `${transferInfo.walletService?.callback}?amount=${
                transferInfo.amount * 1000
              }`
            )
          : transferInfo.data

        const eventTags: NDKTag[] = [['bolt11', bolt11]]

        const txEvent: NostrEvent = await generateTxStart(
          transferInfo.amount * 1000,
          transferInfo.receiverPubkey,
          signer,
          eventTags
        )

        publishTransfer(txEvent)
      }
    } catch {
      router.push('/transfer/error')
    }
  }

  const processStatusTransfer = async (ledgerEvent: NDKEvent) => {
    if (startEvent) {
      const subkind: string = getTag(ledgerEvent.tags, 't')
      if (subkind.includes('error')) router.push('/transfer/error')

      if (subkind.includes('ok')) {
        const refundEvent = await ndk.fetchEvent({
          kinds: [1112 as NDKKind],
          authors: [keys.urlxPubkey],
          '#t': ['internal-transaction-start'],
          '#e': [startEvent.id!]
        })

        refundEvent
          ? router.push('/transfer/error')
          : router.push('/transfer/finish')
      }
    }
  }

  useEffect(() => {
    if (events.length) processStatusTransfer(events[0])
  }, [events])

  useEffect(() => {
    const data: string = params.get('data') ?? ''
    if (!data) return

    prepareTransaction(data)
  }, [])

  return {
    loading,
    transferInfo,
    prepareTransaction,
    setAmountToPay,
    executeTransfer
  }
}

export default useTransfer
