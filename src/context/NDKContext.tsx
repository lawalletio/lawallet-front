import NDK from '@nostr-dev-kit/ndk'
import { createContext, useEffect, useState } from 'react'

interface NDKContextType {
  ndk: NDK
}

export const NDKContext = createContext({} as NDKContextType)

export function NDKProvider({
  children,
  explicitRelayUrls
}: {
  children: React.ReactNode
  explicitRelayUrls: string[]
}) {
  const [ndk] = useState(
    new NDK({
      explicitRelayUrls
    })
  )

  useEffect(() => {
    ndk.connect()
  }, [])

  const value = {
    ndk
  }

  return <NDKContext.Provider value={value}>{children}</NDKContext.Provider>
}
