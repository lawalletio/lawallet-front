import { LAWALLET_ENDPOINT } from '@/constants/config'
import keys from '@/constants/keys'
import { TransferTypes } from '@/types/transaction'
import { NostrEvent } from '@nostr-dev-kit/ndk'

type LightningServiceProps = {
  callback: string
  maxSendable: number
  minSendable: number
  metadata: string
}

export interface TransferInformation {
  data: string
  amount: number
  receiverPubkey: string
  walletService: LightningServiceProps | null
  type: TransferTypes | false
}

export const defaultTransfer: TransferInformation = {
  data: '',
  amount: 0,
  receiverPubkey: keys.urlxPubkey,
  walletService: null,
  type: false
}

export const getWalletService = (
  url: string
): Promise<LightningServiceProps | null> =>
  fetch(url)
    .then(res => res.json())
    .then(walletInfo => {
      if (!walletInfo) return null
      return walletInfo
    })
    .catch(() => null)

export const requestInvoice = (callback: string) =>
  fetch(callback)
    .then(res => res.json())
    .then(invoiceInfo =>
      invoiceInfo && invoiceInfo.pr ? invoiceInfo.pr.toLowerCase() : ''
    )
    .catch(() => '')

export const broadcastTransaction = async (
  event: NostrEvent
): Promise<boolean> => {
  return fetch(`${LAWALLET_ENDPOINT}/nostr/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.status === 200 || res.status === 202)
    .catch(() => false)
}
