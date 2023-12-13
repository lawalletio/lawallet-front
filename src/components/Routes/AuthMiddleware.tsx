import { LaWalletContext } from '@/context/LaWalletContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useContext, useLayoutEffect } from 'react'
import SpinnerView from './SpinnerView'

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
  'transactions',
  'card',
  'voucher',
  'voucherfinish'
]

const unloggedRoutes: string[] = ['', 'start', 'login', 'reset']

const AuthMiddleware = ({ children }: { children: ReactNode }) => {
  const { identity, hydrated } = useContext(LaWalletContext)
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  useLayoutEffect(() => {
    if (hydrated) {
      const cleanedPath: string = pathname.replace(/\//g, '').toLowerCase()
      const userLogged: boolean = Boolean(identity.hexpub.length)
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
  }, [pathname, identity, hydrated])

  return !hydrated ? <SpinnerView /> : children
}

export default AuthMiddleware
