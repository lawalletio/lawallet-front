import { IDENTITY_ENDPOINT } from '@/constants/config'

type VoucherResponse = {
  ok?: string
  error?: string
}

export const requestVoucher = async (
  name: string,
  email: string
): Promise<VoucherResponse> => {
  return fetch(`${IDENTITY_ENDPOINT}/api/voucher/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email })
  })
    .then(res => res.json())
    .catch(() => {
      return {
        error: 'FAILED_REQUEST_VOUCHER'
      }
    })
}

export const claimVoucher = async (
  name: string,
  nonce: string
): Promise<VoucherResponse> => {
  return fetch(`${IDENTITY_ENDPOINT}/api/voucher/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, nonce })
  })
    .then(res => res.json())
    .catch(() => {
      return {
        error: 'FAILED_REQUEST_VOUCHER'
      }
    })
}
