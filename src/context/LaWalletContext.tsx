import { Loader } from '@/components/Loader/Loader'
import { Alert, Flex } from '@/components/UI'
import { useActivity } from '@/hooks/useActivity'
import useAlert, { UseAlertReturns } from '@/hooks/useAlerts'
import useConfiguration, { ConfigReturns } from '@/hooks/useConfiguration'
import useCurrencyConverter, {
  UseConverterReturns
} from '@/hooks/useCurrencyConverter'
import { AvailableLanguages } from '@/translations'
import {
  IdentityWithSigner,
  UserIdentity,
  defaultIdentity
} from '@/types/identity'
import { Transaction, TransactionDirection } from '@/types/transaction'
import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'
import { createContext, useEffect, useState } from 'react'

interface LaWalletContextType {
  lng: AvailableLanguages
  identity: IdentityWithSigner
  setUserIdentity: (new_identity: UserIdentity) => void
  transactions: Transaction[]
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
  const [identity, setIdentity] = useState<IdentityWithSigner>(defaultIdentity)

  const notifications = useAlert()

  const { sortedTransactions: transactions, previousTransactions } =
    useActivity({
      pubkey: identity.hexpub,
      enabled: Boolean(identity.hexpub.length),
      limit: 100
    })

  const userConfig: ConfigReturns = useConfiguration()
  const converter = useCurrencyConverter()

  const preloadIdentity = () => {
    const storageIdentity = localStorage.getItem('identity')
    if (storageIdentity) {
      const userIdentity: UserIdentity = JSON.parse(storageIdentity)
      setUserIdentity(userIdentity)
    }

    setHydrated(true)
    return
  }

  const setUserIdentity = (new_identity: UserIdentity) => {
    setIdentity({
      ...new_identity,
      signer: new NDKPrivateKeySigner(new_identity.privateKey)
    })
    return
  }

  const notifyReceivedTransaction = () => {
    const new_transactions: Transaction[] = transactions.filter(tx => {
      const transactionId: string = tx.id

      const existTransaction: Transaction | undefined =
        previousTransactions.find(prevTx => prevTx.id === transactionId)

      return Boolean(!existTransaction)
    })

    if (
      new_transactions.length &&
      new_transactions[0].direction === TransactionDirection.INCOMING
    )
      notifications.showAlert({
        description: 'TRANSACTION_RECEIVED',
        type: 'success',
        params: {
          sats: (new_transactions[0].tokens.BTC / 1000).toString()
        }
      })
  }

  useEffect(() => {
    preloadIdentity()
  }, [])

  useEffect(() => {
    if (transactions.length) notifyReceivedTransaction()
  }, [transactions.length])

  const value = {
    lng,
    identity,
    setUserIdentity,
    transactions,
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
