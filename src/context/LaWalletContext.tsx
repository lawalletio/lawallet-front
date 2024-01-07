import SpinnerView from '@/components/Loader/SpinnerView'
import { Alert } from '@/components/UI'
import { useActivity } from '@/hooks/useActivity'
import useAlert, { UseAlertReturns } from '@/hooks/useAlerts'
import useConfiguration, { ConfigReturns } from '@/hooks/useConfiguration'
import useCurrencyConverter, {
  UseConverterReturns
} from '@/hooks/useCurrencyConverter'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import useUser, { UserReturns } from '@/hooks/useUser'
import { TokenBalance } from '@/types/balance'
import { Transaction, TransactionDirection } from '@/types/transaction'
import { differenceInSeconds } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from 'react'
import { useTranslation } from './TranslateContext'

interface LaWalletContextType {
  user: UserReturns
  balance: TokenBalance
  userTransactions: Transaction[]
  configuration: ConfigReturns
  notifications: UseAlertReturns
  converter: UseConverterReturns
}

const loggedRoutes: string[] = [
  'dashboard',
  'transfer',
  'transferamount',
  'transferfinish',
  'transfersummary',
  'transfererror',
  'deposit',
  'scan',
  'settings',
  'settingsrecovery',
  'settingscards',
  'transactions',
  'card',
  'voucher',
  'voucherfinish'
]

const unloggedRoutes: string[] = ['', 'start', 'login', 'reset']

export const LaWalletContext = createContext({} as LaWalletContextType)

export function LaWalletProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState<boolean>(false)
  const user: UserReturns = useUser()

  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const notifications = useAlert()

  const { t } = useTranslation()

  const { activityInfo, userTransactions } = useActivity({
    pubkey: user.identity.hexpub,
    enabled: Boolean(user.identity.hexpub.length)
  })

  const configuration: ConfigReturns = useConfiguration()
  const converter = useCurrencyConverter()

  const { balance } = useTokenBalance({
    pubkey: user.identity.hexpub,
    tokenId: 'BTC'
  })

  const notifyReceivedTransaction = () => {
    const new_transactions: Transaction[] = userTransactions.filter(tx => {
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
          description: t('TRANSACTION_RECEIVED', {
            sats: (new_transactions[0].tokens.BTC / 1000).toString()
          }),
          type: 'success'
        })
    }
  }

  useEffect(() => {
    if (user.identity.loaded) setHydrated(true)
  }, [user.identity.loaded])

  useEffect(() => {
    if (userTransactions.length) notifyReceivedTransaction()
  }, [userTransactions.length])

  useLayoutEffect(() => {
    if (hydrated) {
      const cleanedPath: string = pathname.replace(/\//g, '').toLowerCase()
      const userLogged: boolean = Boolean(user.identity.hexpub.length)
      const nonce: string = params.get('i') || ''
      const card: string = params.get('c') || ''

      switch (true) {
        case !userLogged && pathname == '/' && !nonce:
          router.push('/')
          break

        case !userLogged && loggedRoutes.includes(cleanedPath):
          router.push('/')
          break

        case userLogged && unloggedRoutes.includes(cleanedPath):
          card
            ? router.push(`/settings/cards?c=${card}`)
            : router.push('/dashboard')
          break
      }
    }
  }, [pathname, hydrated])

  const value = {
    user,
    balance,
    userTransactions,
    configuration,
    notifications,
    converter
  }

  return (
    <LaWalletContext.Provider value={value}>
      <Alert
        title={notifications.alert?.title}
        description={notifications.alert?.description}
        type={notifications.alert?.type}
        isOpen={!!notifications.alert}
      />

      {!hydrated ? <SpinnerView /> : children}
    </LaWalletContext.Provider>
  )
}

export const useLaWalletContext = () => {
  const context = useContext(LaWalletContext)
  if (!context) {
    throw new Error('useLaWalletContext must be used within LaWalletProvider')
  }

  return context
}
