import { LAWALLET_ENDPOINT } from '@/constants/config'
import keys from '@/constants/keys'
import { TransferTypes } from '@/types/transaction'
import { NostrEvent } from '@nostr-dev-kit/ndk'

interface LNServiceResponse {
  tag: string
  callback: string
  metadata: string
  minSendable?: number
  maxSendable?: number
  k1?: string
  minWithdrawable?: number
  maxWithdrawable?: number
}

export interface TransferInformation {
  data: string
  amount: number
  comment: string
  receiverPubkey: string
  walletService: LNServiceResponse | null
  type: TransferTypes | false
  expired?: boolean
}

export const defaultTransfer: TransferInformation = {
  data: '',
  amount: 0,
  comment: '',
  receiverPubkey: keys.urlxPubkey,
  walletService: null,
  type: false
}

export const getWalletService = (url: string): Promise<LNServiceResponse> =>
  fetch(url)
    .then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
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
