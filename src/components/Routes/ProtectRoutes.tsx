import Logo from '@/components/Logo'
import { LaWalletContext } from '@/context/LaWalletContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useContext, useEffect } from 'react'
import { Loader } from '../Loader/Loader'
import { Divider, Flex, Text } from '../UI'
import Container from '../Layout/Container'
import theme from '@/styles/theme'
import { LAWALLET_VERSION } from '@/constants/constants'

const loggedRoutes: string[] = [
  'dashboard',
  'transfer',
  'deposit',
  'scan',
  'settings',
  'transactions',
  'card',
  'voucher'
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
      // const card: string = params.get('c') || ''

      switch (true) {
        case !userLogged && pathname == '/' && !nonce:
          router.push('/')
          break

        case !userLogged && loggedRoutes.includes(cleanedPath):
          router.push('/')
          break

        case userLogged && unloggedRoutes.includes(cleanedPath):
          // router.push(card ? `/card?c=${card}` : '/dashboard')
          router.push('/dashboard')
          break
      }
    }
  }, [pathname, identity, hydrated])

  if (!hydrated)
    return (
      <Container size="medium">
        <Divider y={16} />
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={8}
          flex={1}
        >
          <Logo />
          <Text align="center" color={theme.colors.gray50}>
            {LAWALLET_VERSION}
          </Text>
        </Flex>

        <Flex flex={1} justify="center" align="center">
          <Loader />
        </Flex>
      </Container>
    )

  return children
}

export default ProtectRoutes
