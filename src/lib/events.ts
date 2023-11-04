import { RelaysList } from '@/constants/config'
import keys from '@/constants/keys'
import { UserIdentity } from '@/types/identity'
import {
  NDKEvent,
  NDKPrivateKeySigner,
  NDKTag,
  NostrEvent
} from '@nostr-dev-kit/ndk'
import { getPublicKey, nip26 } from 'nostr-tools'

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

export const cardActivationEvent = async (
  otc: string,
  privateKey: string
): Promise<NostrEvent> => {
  const signer = new NDKPrivateKeySigner(privateKey)
  const pubkey: string = getPublicKey(privateKey)

  const delegation = nip26.createDelegation(privateKey, {
    pubkey: keys.cardPubkey,
    kind: 1112,
    since: Math.floor(Date.now() / 1000) - 36000,
    until: Math.floor(Date.now() / 1000) + 3600 * 24 * 30 * 12
  })

  const event: NDKEvent = new NDKEvent()
  event.pubkey = pubkey
  event.kind = 21111

  event.content = JSON.stringify({
    otc,
    delegation: {
      conditions: delegation.cond,
      token: delegation.sig
    }
  })

  event.tags = [['t', 'asociate-card']]

  await event.sign(signer)
  return event.toNostrEvent()
}

export const zapRequestEvent = async (amount: number, privateKey: string) => {
  const signer = new NDKPrivateKeySigner(privateKey)
  const pubkey: string = getPublicKey(privateKey)

  const zapEvent: NDKEvent = new NDKEvent()
  zapEvent.pubkey = pubkey
  zapEvent.kind = 9734

  zapEvent.tags = [
    ['p', pubkey],
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
  tags: NDKTag[]
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

  if (tags.length) internalEvent.tags = [...internalEvent.tags, ...tags]
  await internalEvent.sign(signer!)

  const event: NostrEvent = await internalEvent.toNostrEvent()
  return event
}
