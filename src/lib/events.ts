import { RelaysList } from '@/constants/config'
import keys from '@/constants/keys'
import { UserIdentity } from '@/types/identity'
import {
  NDKEvent,
  NDKPrivateKeySigner,
  NDKTag,
  NostrEvent
} from '@nostr-dev-kit/ndk'
import { getPublicKey } from 'nostr-tools'

export type GenerateIdentityReturns = {
  identity: UserIdentity
  event: NostrEvent
}

export const getTag = (tags: NDKTag[], keyTag: string) => {
  const tagValue = tags.find(tag => tag[0] === keyTag)
  return tagValue ? tagValue[1] : ''
}

export const getMultipleTags = (tags: NDKTag[], keyTag: string) => {
  const values: string[] = []

  const tagsValue: NDKTag[] = tags.filter(tag => tag[0] === keyTag)
  tagsValue.forEach(tag => values.push(tag[1]))

  return values
}

export const identityEvent = async (
  nonce: string,
  identity: UserIdentity
): Promise<NostrEvent> => {
  const signer = new NDKPrivateKeySigner(identity.privateKey)
  const event: NDKEvent = new NDKEvent()
  event.pubkey = identity.hexpub
  event.kind = 1112

  event.content = JSON.stringify({
    name: identity.username,
    pubkey: identity.hexpub
  })

  event.tags = [
    ['t', 'create-identity'],
    ['name', identity.username],
    ['nonce', nonce]
  ]

  await event.sign(signer)
  return event.toNostrEvent()
}

export const zapRequestEvent = async (
  amount: number,
  identity: UserIdentity
) => {
  const signer = new NDKPrivateKeySigner(identity.privateKey)
  const zapEvent: NDKEvent = new NDKEvent()
  zapEvent.pubkey = identity.hexpub
  zapEvent.kind = 9734

  zapEvent.tags = [
    ['p', identity.hexpub],
    ['amount', amount.toString()],
    ['relays', ...RelaysList]
  ]

  await zapEvent.sign(signer)

  const requestEvent: string = encodeURI(
    JSON.stringify(await zapEvent.toNostrEvent())
  )
  return requestEvent
}

export const generateTxStart = async (
  amount: number,
  receiver: string,
  signer: NDKPrivateKeySigner,
  bolt11?: string
): Promise<NostrEvent> => {
  const hexpub = getPublicKey(signer.privateKey!)

  const internalEvent: NDKEvent = new NDKEvent()
  internalEvent.pubkey = hexpub
  internalEvent.kind = 1112

  internalEvent.content = JSON.stringify({
    tokens: { BTC: amount.toString() }
  })

  internalEvent.tags = [
    ['t', 'internal-transaction-start'],
    ['p', keys.ledgerPubkey],
    ['p', receiver]
  ]

  if (bolt11) internalEvent.tags.push(['bolt11', bolt11])
  await internalEvent.sign(signer!)

  const event: NostrEvent = await internalEvent.toNostrEvent()
  return event
}
