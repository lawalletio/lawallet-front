'use client'
import { Button, Flex, Modal, Text } from '@/components/UI'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import { AlertTypes } from '@/hooks/useAlerts'
import { requestCardActivation } from '@/interceptors/card'
import { buildCardActivationEvent } from '@/lib/events'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export type NewCard = {
  card: string
  loading: boolean
}

const defaultNewCard = {
  card: '',
  loading: false
}

const AddNewCardModal = () => {
  const [newCardInfo, setNewCardInfo] = useState<NewCard>(defaultNewCard)

  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const {
    user: { identity },
    notifications
  } = useLaWalletContext()

  const resetCardInfo = () => {
    setNewCardInfo(defaultNewCard)
    router.replace(pathname)
  }

  const sendNotification = (
    alertDescription: string,
    alertType: AlertTypes
  ) => {
    notifications.showAlert({
      description: alertDescription,
      type: alertType
    })

    resetCardInfo()
  }

  const handleActivateCard = () => {
    if (newCardInfo.loading) return
    setNewCardInfo({
      ...newCardInfo,
      loading: true
    })

    buildCardActivationEvent(newCardInfo.card, identity.privateKey)
      .then((cardEvent: NostrEvent) => {
        requestCardActivation(cardEvent).then(cardActivated => {
          const description: string = cardActivated
            ? 'ACTIVATE_SUCCESS'
            : 'ACTIVATE_ERROR'

          const type: AlertTypes = cardActivated ? 'success' : 'error'

          sendNotification(description, type)
        })
      })
      .catch(() => {
        sendNotification('ACTIVATE_ERROR', 'error')
      })
  }

  useEffect(() => {
    const card: string = params.get('c') ?? ''

    setNewCardInfo({
      card,
      loading: false
    })
  }, [])

  return (
    <Modal
      title={t('NEW_CARD')}
      isOpen={Boolean(newCardInfo.card.length)}
      onClose={() => null}
    >
      <Text>{t('DETECT_NEW_CARD')}</Text>
      <Flex direction="column" gap={4}>
        <Flex>
          <Button onClick={handleActivateCard}>{t('ACTIVATE_CARD')}</Button>
        </Flex>
        <Flex>
          <Button variant="borderless" onClick={resetCardInfo}>
            {t('CANCEL')}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default AddNewCardModal
