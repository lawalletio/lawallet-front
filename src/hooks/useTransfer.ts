import { LAWALLET_ENDPOINT, LaWalletPubkeys } from '@/constants/config'
import { NDKContext } from '@/context/NDKContext'
import {
  TransferInformation,
  defaultTransfer,
  requestInvoice
} from '@/interceptors/transaction'
import {
  LaWalletKinds,
  LaWalletTags,
  buildTxStartEvent,
  getTag
} from '@/lib/events'
import {
  addQueryParameter,
  escapingBrackets,
  formatTransferData
} from '@/lib/utils'
import { TransferTypes } from '@/types/transaction'
import { NDKEvent, NDKKind, NDKTag, NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter, useSearchParams } from 'next/navigation'
import { getPublicKey, nip19 } from 'nostr-tools'
import { useContext, useEffect, useState } from 'react'
import { useSubscription } from './useSubscription'
import { broadcastEvent } from '@/interceptors/publish'

export interface TransferContextType {
  loading: boolean
  transferInfo: TransferInformation
  prepareTransaction: (data: string) => Promise<boolean>
  setAmountToPay: (amount: number) => void
  setComment: (comment: string) => void
  executeTransfer: (privateKey: string) => void
}

interface TransferProps {
  tokenName: string
}

const useTransfer = ({ tokenName }: TransferProps): TransferContextType => {
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
        authors: [LaWalletPubkeys.ledgerPubkey],
        kinds: [LaWalletKinds.REGULAR as unknown as NDKKind],
        since: startEvent ? startEvent.created_at - 60000 : undefined,
        '#e': startEvent?.id ? [startEvent.id] : []
      }
    ],
    options: {},
    enabled: Boolean(startEvent?.id)
  })

  const claimLNURLw = (info: TransferInformation, npub: string) => {
    const { walletService } = info

    requestInvoice(
      `${LAWALLET_ENDPOINT}/lnurlp/${npub}/callback?amount=${walletService?.maxWithdrawable}`
    )
      .then(pr => {
        if (pr) {
          let urlCallback: string = walletService!.callback
          urlCallback = addQueryParameter(
            urlCallback,
            `k1=${walletService!.k1!}`
          )
          urlCallback = addQueryParameter(urlCallback, `pr=${pr}`)

          fetch(urlCallback).then(res => {
            if (res.status !== 200) router.push('/transfer/error')

            router.push('/transfer/finish')
            return
          })
        }
      })
      .catch(() => router.push('/transfer/error'))
  }

  const prepareTransaction = async (data: string) => {
    const formattedTransferInfo: TransferInformation =
      await formatTransferData(data)

    switch (formattedTransferInfo.type) {
      case false:
        return false

      case TransferTypes.LNURLW:
        if (!formattedTransferInfo.walletService?.maxWithdrawable) return false
        router.push(`/transfer/summary?data=${formattedTransferInfo.data}`)
        break

      case TransferTypes.INVOICE:
        if (formattedTransferInfo.amount > 0)
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

  const setComment = (comment: string) => {
    setTransferInfo({
      ...transferInfo,
      comment
    })
  }

  const publishTransfer = (event: NostrEvent) => {
    setStartEvent(event)
    broadcastEvent(event).then(published => {
      if (!published) router.push('/transfer/error')
    })
  }

  const execInternalTransfer = async (
    privateKey: string,
    info: TransferInformation
  ) => {
    const txEvent: NostrEvent = await buildTxStartEvent(
      tokenName,
      info,
      [],
      privateKey
    )
    publishTransfer(txEvent)
  }

  const execOutboundTransfer = async (privateKey: string) => {
    const bolt11: string = transferInfo.walletService
      ? await requestInvoice(
          `${transferInfo.walletService?.callback}?amount=${
            transferInfo.amount * 1000
          }&comment=${escapingBrackets(transferInfo.comment)}`
        )
      : transferInfo.data

    const eventTags: NDKTag[] = [['bolt11', bolt11]]
    const txEvent: NostrEvent = await buildTxStartEvent(
      tokenName,
      transferInfo,
      eventTags,
      privateKey
    )

    publishTransfer(txEvent)
  }

  const executeTransfer = (privateKey: string) => {
    if (loading || !transferInfo.type || transferInfo.expired) return
    setLoading(true)

    try {
      if (transferInfo.type === TransferTypes.LNURLW) {
        const npubKey = nip19.npubEncode(getPublicKey(privateKey))
        claimLNURLw(transferInfo, npubKey)
      } else if (transferInfo.type === TransferTypes.INTERNAL) {
        execInternalTransfer(privateKey, transferInfo)
      } else {
        execOutboundTransfer(privateKey)
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
          kinds: [LaWalletKinds.REGULAR as unknown as NDKKind],
          authors: [LaWalletPubkeys.urlxPubkey],
          '#t': [LaWalletTags.INTERNAL_TRANSACTION_START],
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
    setComment,
    executeTransfer
  }
}

export default useTransfer
