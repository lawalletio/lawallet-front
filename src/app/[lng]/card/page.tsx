'use client'
import { Divider, Flex, Text, Button } from '@/components/UI'
import Container from '@/components/Layout/Container'
import Logo from '@/components/Logo'

import theme from '@/styles/theme'
import { useTranslation } from '@/hooks/useTranslations'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { LaWalletContext } from '@/context/LaWalletContext'
import { cardActivationEvent } from '@/lib/events'
import { requestCardActivation } from '@/interceptors/card'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { LAWALLET_VERSION } from '@/constants/constants'

const ActivateCardPage = () => {
  const [cardInfo, setCardInfo] = useState({
    card: '',
    loading: false
  })
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()

  const { identity, notifications } = useContext(LaWalletContext)

  const handleResponse = (alertDescription: string, alertType) => {
    notifications.showAlert({
      description: alertDescription,
      type: alertType
    })

    setLoading(false)
    router.push('/dashboard')
  }

  const handleActivateCard = () => {
    if (loading) return
    setLoading(true)

    cardActivationEvent(cardInfo.card, identity.privateKey)
      .then((cardEvent: NostrEvent) => {
        requestCardActivation(cardEvent).then(res => {
          const description: string = res
            ? 'ACTIVATE_SUCCESS'
            : 'ACTIVATE_ERROR'
          const type: string = res ? 'success' : 'error'

          handleResponse(description, type)
        })
      })
      .catch(() => {
        handleResponse('ACTIVATE_ERROR', 'error')
      })
  }

  useEffect(() => {
    const card: string = params.get('c') ?? ''
    if (!card) router.push('/dashboard')

    setCardInfo({
      card,
      loading: false
    })
  }, [])

  return (
    <>
      <Container size="small">
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

        <Flex direction="column">
          <Flex direction="column" align="center" gap={8}>
            <Text align="center">{t('DETECT_NEW_CARD')}</Text>
          </Flex>
          <Divider y={16} />

          <Flex>
            <Button onClick={handleActivateCard}>{t('ACTIVATE_CARD')}</Button>
          </Flex>
        </Flex>
        <Divider y={32} />
      </Container>
    </>
  )
}

export default ActivateCardPage
