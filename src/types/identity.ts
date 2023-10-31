import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

export interface UserIdentity {
  nonce: string
  username: string
  card: string[]
  hexpub: string
  npub: string
  privateKey: string
}

export interface IdentityWithSigner extends UserIdentity {
  signer: NDKPrivateKeySigner | null
}

export const defaultIdentity: IdentityWithSigner = {
  nonce: '',
  username: '',
  card: [],
  hexpub: '',
  privateKey: '',
  npub: '',
  signer: null
}
