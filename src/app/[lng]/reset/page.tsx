'use client'
import Logo from '@/components/Logo'
import Container from '@/components/Layout/Container'
import { Loader } from '@/components/Loader/Loader'

import { Divider, Flex, Heading, Text } from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/hooks/useTranslations'
import { requestCardActivation } from '@/interceptors/card'
import { generateUserIdentity } from '@/interceptors/identity'
import { cardActivationEvent } from '@/lib/events'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect } from 'react'
import { LAWALLET_VERSION } from '@/constants/constants'
import theme from '@/styles/theme'

export default function Page() {
  const { t } = useTranslation()
  const { setUserIdentity } = useContext(LaWalletContext)

  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const recoveryNonce: string = params.get('n') || ''
    if (!recoveryNonce) {
      // router.push('/')
      return
    }

    const username: string = 'test'
    generateUserIdentity(recoveryNonce, username).then(generatedIdentity => {
      setUserIdentity(generatedIdentity).then(() => {
        // console.log(generatedIdentity)
        // cardActivationEvent(recoveryNonce, generatedIdentity.privateKey)
        //   .then((cardEvent: NostrEvent) => {
        //     requestCardActivation(cardEvent).then(() => {
        //       router.push('/dashboard')
        //     })
        //   })
        //   .catch(() => router.push('/'))
      })
    })
  }, [])

  return (
    <Container size="medium">
      <Flex direction="column" align="center" justify="center" gap={8} flex={1}>
        <Logo />
        <Text align="center" color={theme.colors.gray50}>
          {LAWALLET_VERSION}
        </Text>
      </Flex>

      <Flex direction="column" align="center" justify="center">
        <Heading as="h2">{t('RECOVERING_ACCOUNT')}</Heading>
      </Flex>

      <Flex flex={1} justify="center" align="center">
        <Loader />
      </Flex>
    </Container>
  )
}
