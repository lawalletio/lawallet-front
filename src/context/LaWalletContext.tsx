import { Loader } from '@/components/Loader/Loader'
import { Alert, Flex } from '@/components/UI'
import { STORAGE_IDENTITY_KEY } from '@/constants/constants'
import { useActivity } from '@/hooks/useActivity'
import useAlert, { UseAlertReturns } from '@/hooks/useAlerts'
import useConfiguration, { ConfigReturns } from '@/hooks/useConfiguration'
import useCurrencyConverter, {
  UseConverterReturns
} from '@/hooks/useCurrencyConverter'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { getUsername } from '@/interceptors/identity'
import { AvailableLanguages } from '@/translations'
import { TokenBalance } from '@/types/balance'
import { UserIdentity, defaultIdentity } from '@/types/identity'
import { Transaction, TransactionDirection } from '@/types/transaction'
import { differenceInSeconds } from 'date-fns'
import { getPublicKey } from 'nostr-tools'
import { createContext, useEffect, useState } from 'react'

interface LaWalletContextType {
  lng: AvailableLanguages
  identity: UserIdentity
  setUserIdentity: (new_identity: UserIdentity) => Promise<void>
  balance: TokenBalance
  sortedTransactions: Transaction[]
  userConfig: ConfigReturns
  notifications: UseAlertReturns
  converter: UseConverterReturns
  hydrated: boolean
}

export const LaWalletContext = createContext({} as LaWalletContextType)

export function LaWalletProvider({
  children,
  lng
}: {
  children: React.ReactNode
  lng: AvailableLanguages
}) {
  const [hydrated, setHydrated] = useState<boolean>(false)
  const [identity, setIdentity] = useState<UserIdentity>(defaultIdentity)

  const notifications = useAlert()

  const { activityInfo, sortedTransactions } = useActivity({
    pubkey: identity.hexpub,
    enabled: Boolean(identity.hexpub.length),
    limit: 100
  })

  const userConfig: ConfigReturns = useConfiguration()
  const converter = useCurrencyConverter()

  const { balance } = useTokenBalance({
    pubkey: identity.hexpub,
    tokenId: 'BTC'
  })

  const preloadIdentity = async () => {
    const storageIdentity = localStorage.getItem(STORAGE_IDENTITY_KEY)
    if (storageIdentity) {
      const userIdentity: UserIdentity = JSON.parse(storageIdentity)

      if (userIdentity.privateKey) {
        const hexpub: string = getPublicKey(userIdentity.privateKey)

        if (hexpub === userIdentity.hexpub) {
          setIdentity(userIdentity)
        } else {
          const username: string = await getUsername(hexpub)
          if (username)
            setIdentity({
              ...userIdentity,
              hexpub,
              username
            })
        }
      }
    }

    setHydrated(true)
    return
  }

  const setUserIdentity = async (new_identity: UserIdentity) => {
    setIdentity(new_identity)
    localStorage.setItem(STORAGE_IDENTITY_KEY, JSON.stringify(new_identity))
    return
  }

  const notifyReceivedTransaction = () => {
    const new_transactions: Transaction[] = sortedTransactions.filter(tx => {
      const transactionId: string = tx.id
      return Boolean(!activityInfo.idsLoaded.includes(transactionId))
    })

    if (
      new_transactions.length &&
      new_transactions[0].direction === TransactionDirection.INCOMING
    ) {
      const secondsSinceCreated: number = differenceInSeconds(
        new Date(),
        new Date(new_transactions[0].createdAt)
      )

      if (secondsSinceCreated < 15)
        notifications.showAlert({
          description: 'TRANSACTION_RECEIVED',
          type: 'success',
          params: {
            sats: (new_transactions[0].tokens.BTC / 1000).toString()
          }
        })
    }
  }

  useEffect(() => {
    preloadIdentity()
  }, [])

  useEffect(() => {
    if (sortedTransactions.length) notifyReceivedTransaction()
  }, [sortedTransactions.length])

  const value = {
    lng,
    identity,
    setUserIdentity,
    balance,
    sortedTransactions,
    userConfig,
    notifications,
    converter,
    hydrated
  }

  if (!hydrated)
    return (
      <Flex flex={1} justify="center" align="center">
        <Loader />
      </Flex>
    )

  return (
    <LaWalletContext.Provider value={value}>
      <Alert
        title={notifications.alert?.title}
        description={notifications.alert?.description}
        type={notifications.alert?.type}
        isOpen={!!notifications.alert}
        params={notifications.alert?.params}
      />

      {children}
    </LaWalletContext.Provider>
  )
}
