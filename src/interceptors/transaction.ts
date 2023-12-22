import config from '@/constants/config'
import { TransferTypes } from '@/types/transaction'

interface LNServiceResponse {
  tag: string
  callback: string
  metadata: string
  commentAllowed: number
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

export type CheckInvoiceReturns = {
  handled: boolean
  comment: string
  zapRequest: string
  pubkey: string
}

export const defaultTransfer: TransferInformation = {
  data: '',
  amount: 0,
  comment: '',
  receiverPubkey: config.pubKeys.urlxPubkey,
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

export const isInternalInvoice = (
  invoiceHash: string
): Promise<CheckInvoiceReturns | null> =>
  fetch(`${config.env.LAWALLET_ENDPOINT}/invoice/${invoiceHash}`)
    .then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(invoiceResponse => {
      if (!invoiceResponse) return null
      return invoiceResponse
    })
    .catch(() => null)

export const requestInvoice = (callback: string) =>
  fetch(callback)
    .then(res => res.json())
    .then(invoiceInfo =>
      invoiceInfo && invoiceInfo.pr ? invoiceInfo.pr.toLowerCase() : ''
    )
    .catch(() => '')
