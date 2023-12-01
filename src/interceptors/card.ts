import { LAWALLET_ENDPOINT } from '@/constants/config'
import { NostrEvent } from '@nostr-dev-kit/ndk'

export const requestCardActivation = async (
  event: NostrEvent
): Promise<boolean> => {
  return fetch(`${LAWALLET_ENDPOINT}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.status >= 200 || res.status <= 204)
    .catch(() => false)
}

export const cardResetCaim = async (
  event: NostrEvent
): Promise<Record<'name' | 'error', string>> => {
  return fetch(`${LAWALLET_ENDPOINT}/card/reset/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.json())
    .catch(() => {
      return { error: 'ERROR_ON_RESET_ACCOUNT' }
    })
}

export const cardInfoRequest = async (
  type: string,
  event: NostrEvent
): Promise<any> => {
  return fetch(`${LAWALLET_ENDPOINT}/card/${type}/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => {
      console.log(res)
      return res.json()
    })
    .catch(err => {
      console.log(err)
      return { error: 'UNEXPECTED_ERROR' }
    })
}
