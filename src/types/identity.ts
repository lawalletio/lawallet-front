export interface UserIdentity {
  nonce: string
  username: string
  card: string[]
  hexpub: string
  npub: string
  privateKey: string
}

export const defaultIdentity: UserIdentity = {
  nonce: '',
  username: '',
  card: [],
  hexpub: '',
  privateKey: '',
  npub: ''
}
