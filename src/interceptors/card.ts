import { LAWALLET_ENDPOINT } from '@/constants/config'
import { NostrEvent } from '@nostr-dev-kit/ndk'

export const requestCardAssociation = async (
  event: NostrEvent
): Promise<boolean> => {
  return fetch(`${LAWALLET_ENDPOINT}/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.json())
    .then(response => {
      console.log(response)
      return true
    })
    .catch(() => {
      return false
    })
}
