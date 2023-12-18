'use client'
import Container from '@/components/Layout/Container'
import { Loader } from '@/components/Loader/Loader'
import Logo from '@/components/Logo'

import { Feedback, Flex, Heading, Text } from '@/components/UI'
import { LAWALLET_VERSION } from '@/constants/constants'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import useErrors from '@/hooks/useErrors'
import { cardResetCaim } from '@/interceptors/card'
import { generateUserIdentity } from '@/interceptors/identity'
import { buildCardActivationEvent } from '@/lib/events'
import theme from '@/styles/theme'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { t } = useTranslation()
  const {
    user: { identity, setUser }
  } = useLaWalletContext()

  const router = useRouter()
  const errors = useErrors()
  const params = useSearchParams()

  useEffect(() => {
    if (identity.hexpub.length) return

    const recoveryNonce: string = params.get('n') || ''
    if (!recoveryNonce) {
      router.push('/')
      return
    }

    generateUserIdentity().then(generatedIdentity => {
      buildCardActivationEvent(recoveryNonce, generatedIdentity.privateKey)
        .then((cardEvent: NostrEvent) => {
          cardResetCaim(cardEvent).then(res => {
            if (res.error) errors.modifyError(res.error)

            if (res.name) {
              setUser({
                ...generatedIdentity,
                username: res.name
              }).then(() => router.push('/dashboard'))
            } else {
              errors.modifyError('ERROR_ON_RESET_ACCOUNT')
            }
          })
        })
        .catch(() => router.push('/'))
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

      <Flex flex={1} justify="center" align="center">
        <Feedback show={errors.errorInfo.visible} status={'error'}>
          {errors.errorInfo.text}
        </Feedback>
      </Flex>
    </Container>
  )
}
