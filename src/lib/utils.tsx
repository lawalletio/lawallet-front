import { WALLET_DOMAIN } from '@/constants/config'
import { getUserPubkey } from '@/interceptors/identity'
import {
  TransferInformation,
  defaultTransfer,
  getWalletService
} from '@/interceptors/transaction'
import { TransferTypes } from '@/types/transaction'
import bolt11 from 'light-bolt11-decoder'
import lnurl from './lnurl'

export const formatBigNumber = (number: number | string) => {
  return Number(number).toLocaleString('es-ES')
}

export const validateEmail = (email: string): RegExpMatchArray | null => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

export const detectTransferType = (data: string): TransferTypes | false => {
  const isLUD16 = validateEmail(data)
  if (isLUD16) {
    const domain: string = data.split('@')[1]

    return domain.toUpperCase() === WALLET_DOMAIN.toUpperCase()
      ? TransferTypes.INTERNAL
      : TransferTypes.LUD16
  }

  if (data.startsWith('LNURL')) return TransferTypes.LNURL
  if (data.startsWith('LNBC')) return TransferTypes.INVOICE

  return false
}

const parseInvoiceInfo = (invoice: string) => {
  const decodedInvoice = bolt11.decode(invoice)
  const invoiceAmount = decodedInvoice.sections.find(
    (section: Record<string, string>) => section.name === 'amount'
  )

  const transfer: TransferInformation = {
    ...defaultTransfer,
    data: invoice.toLowerCase(),
    type: TransferTypes.INVOICE,
    amount: invoiceAmount.value / 1000
  }

  return transfer
}

const removeHttpOrHttps = (str: string) => {
  if (str.startsWith('http://')) return str.replace('http://', '')
  if (str.startsWith('https://')) return str.replace('https://', '')

  return str
}

const isInternalLNURL = (decodedLNURL: string): string => {
  const urlWithoutHttp: string = removeHttpOrHttps(decodedLNURL)
  const [domain, , , username] = urlWithoutHttp.split('/')
  if (domain === WALLET_DOMAIN && username) return `${username}@${domain}`

  return ''
}

const parseLNURLInfo = async (data: string) => {
  const decodedLNURL = lnurl.decode(data)
  const internalLUD16: string = isInternalLNURL(decodedLNURL)
  if (internalLUD16.length) return parseINTERNALInfo(internalLUD16)

  const walletService = await getWalletService(decodedLNURL)
  if (!walletService) return defaultTransfer

  const transfer: TransferInformation = {
    ...defaultTransfer,
    data,
    type: TransferTypes.LNURL,
    walletService
  }

  try {
    const parsedMetadata: Array<string>[] = JSON.parse(walletService.metadata)
    const identifier: string[] | undefined = parsedMetadata.find(
      (data: string[]) => {
        if (data[0] === 'text/identifier') return data
      }
    )

    if (identifier && identifier.length === 2) transfer.data = identifier[1]
  } catch (error) {
    console.log(error)
  }

  return transfer
}

const parseLUD16Info = async (data: string) => {
  const [username, domain] = data.split('@')

  const walletService = await getWalletService(
    `https://${domain}/.well-known/lnurlp/${username}`
  )
  if (!walletService) return defaultTransfer

  const transfer: TransferInformation = {
    ...defaultTransfer,
    data,
    type: TransferTypes.LUD16,
    walletService
  }

  if (walletService.minSendable == walletService.maxSendable)
    transfer.amount = walletService.maxSendable / 1000

  return transfer
}

const parseINTERNALInfo = async (data: string) => {
  const [username] = data.split('@')
  const receiverPubkey: string = await getUserPubkey(username)
  if (!receiverPubkey) return defaultTransfer

  const transfer: TransferInformation = {
    ...defaultTransfer,
    data,
    type: TransferTypes.INTERNAL,
    receiverPubkey
  }

  return transfer
}

export const formatTransferData = async (
  data: string
): Promise<TransferInformation> => {
  if (!data.length) return defaultTransfer

  const cleanStr: string = data.startsWith('lightning://')
    ? data.replace('lightning://', '')
    : data

  const decodedTransferType: TransferTypes | false = detectTransferType(
    cleanStr.toUpperCase()
  )

  if (!decodedTransferType) return defaultTransfer

  switch (decodedTransferType) {
    case TransferTypes.INVOICE:
      return parseInvoiceInfo(cleanStr)

    case TransferTypes.LNURL:
      return parseLNURLInfo(cleanStr)

    case TransferTypes.LUD16:
      return parseLUD16Info(cleanStr)

    default:
      return parseINTERNALInfo(cleanStr)
  }
}

export function checkIOS(navigator: Navigator) {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return true
  } else {
    return Boolean(
      navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.userAgent)
    )
  }
}
