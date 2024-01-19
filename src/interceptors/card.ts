import config from '@/constants/config'
import { buildCardConfigEvent } from '@/lib/events'
import { CardConfigPayload, CardDataPayload } from '@/types/card'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { broadcastEvent } from './publish'

export const requestCardActivation = async (
  event: NostrEvent
): Promise<boolean> => {
  return fetch(`${config.env.LAWALLET_ENDPOINT}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.status >= 200 && res.status < 300)
    .catch(() => false)
}

export const cardResetCaim = async (
  event: NostrEvent
): Promise<Record<'name' | 'error', string>> => {
  return fetch(`${config.env.LAWALLET_ENDPOINT}/card/reset/claim`, {
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

export type CardRequestResponse =
  | CardConfigPayload
  | CardDataPayload
  | Record<'error', string>

export const cardInfoRequest = async (
  type: string,
  event: NostrEvent
): Promise<CardRequestResponse> => {
  return fetch(`${config.env.LAWALLET_ENDPOINT}/card/${type}/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.json())
    .catch(() => {
      return { error: 'UNEXPECTED_ERROR' }
    })
}

export const buildAndBroadcastCardConfig = (
  config: CardConfigPayload,
  privateKey: string
): Promise<boolean> => {
  return buildCardConfigEvent(config, privateKey)
    .then(configEvent => {
      return broadcastEvent(configEvent)
    })
    .catch(() => {
      return false
    })
}