export interface UserIdentity {
  username: string
  hexpub: string
  npub: string
  privateKey: string
  loaded: boolean
}

export const defaultIdentity: UserIdentity = {
  username: '',
  hexpub: '',
  privateKey: '',
  npub: '',
  loaded: false
}
