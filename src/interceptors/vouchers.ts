import config from '@/constants/config'

type VoucherResponse = {
  ok?: string
  error?: string
}

export const requestVoucher = async (
  name: string,
  email: string
): Promise<VoucherResponse> => {
  return fetch(`${config.env.IDENTITY_ENDPOINT}/api/voucher/request`, {
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
  code: string
): Promise<VoucherResponse> => {
  return fetch(`${config.env.IDENTITY_ENDPOINT}/api/voucher/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, code })
  })
    .then(res => res.json())
    .catch(() => {
      return {
        error: 'FAILED_REQUEST_VOUCHER'
      }
    })
}
