import { LaWalletContext } from '@/context/LaWalletContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useContext, useEffect } from 'react'
import { Loader } from '../Loader/Loader'
import { Flex } from '../UI'

const loggedRoutes: string[] = [
  'dashboard',
  'transfer',
  'deposit',
  'scan',
  'settings',
  'transactions'
]

const unloggedRoutes: string[] = ['', 'start', 'login']

const ProtectRoutes = ({ children }: { children: ReactNode }) => {
  const { identity, hydrated } = useContext(LaWalletContext)
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  useEffect(() => {
    if (hydrated) {
      const cleanedPath: string = pathname.replace(/\//g, '')
      const userLogged: boolean = Boolean(identity.username.length)
      const nonce: string = params.get('i') || ''

      switch (true) {
        case !userLogged && pathname == '/' && !nonce:
          router.push('/')
          break

        case !userLogged && loggedRoutes.includes(cleanedPath):
          router.push('/')
          break

        case userLogged && unloggedRoutes.includes(cleanedPath):
          router.push('/dashboard')
          break
      }
    }
  }, [pathname, identity, hydrated])

  if (!hydrated)
    return (
      <Flex flex={1} justify="center" align="center">
        <Loader />
      </Flex>
    )

  return children
}

export default ProtectRoutes
