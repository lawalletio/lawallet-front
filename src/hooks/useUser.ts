import { STORAGE_IDENTITY_KEY } from '@/constants/constants'
import { getUsername } from '@/interceptors/identity'
import { parseContent } from '@/lib/utils'
import { UserIdentity, defaultIdentity } from '@/types/identity'
import { getPublicKey } from 'nostr-tools'
import { useEffect, useState } from 'react'

export interface UserReturns {
  identity: UserIdentity
  setUser: (new_identity: UserIdentity) => Promise<void>
}

const useUser = () => {
  const [identity, setIdentity] = useState<UserIdentity>(defaultIdentity)

  const preloadIdentity = async () => {
    const storageIdentity = localStorage.getItem(STORAGE_IDENTITY_KEY)

    if (!storageIdentity) {
      setIdentity({
        ...defaultIdentity,
        loaded: true
      })

      return
    }

    const parsedIdentity: UserIdentity = parseContent(storageIdentity)

    if (parsedIdentity.privateKey) {
      const hexpub: string = getPublicKey(parsedIdentity.privateKey)
      const username: string = await getUsername(hexpub)

      if (
        hexpub === parsedIdentity.hexpub &&
        username == parsedIdentity.username
      ) {
        setIdentity({
          ...parsedIdentity,
          loaded: true
        })
      } else {
        setIdentity({
          ...parsedIdentity,
          hexpub,
          username,
          loaded: true
        })
      }
    }

    return
  }

  const setUser = async (new_identity: UserIdentity) => {
    setIdentity(new_identity)
    localStorage.setItem(STORAGE_IDENTITY_KEY, JSON.stringify(new_identity))
    return
  }

  useEffect(() => {
    preloadIdentity()
  }, [])

  return {
    identity,
    setUser
  }
}

export default useUser
