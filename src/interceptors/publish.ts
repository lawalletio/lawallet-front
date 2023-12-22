import config from '@/constants/config'
import { NostrEvent } from '@nostr-dev-kit/ndk'

export const broadcastEvent = async (event: NostrEvent): Promise<boolean> => {
  return fetch(`${config.env.LAWALLET_ENDPOINT}/nostr/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.status === 200 || res.status === 202)
    .catch(() => false)
}
