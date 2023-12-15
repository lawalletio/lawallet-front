export interface UserIdentity {
  username: string
  hexpub: string
  npub: string
  privateKey: string
}

export const defaultIdentity: UserIdentity = {
  username: '',
  hexpub: '',
  privateKey: '',
  npub: ''
}
