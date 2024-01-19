'use client'
import Navbar from '@/components/Layout/Navbar'
import { Button, Flex, Modal, Text } from '@/components/UI'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'
import { requestCardActivation } from '@/interceptors/card'
import { buildCardTransferAcceptEvent } from '@/lib/events'
import { NostrEvent } from '@nostr-dev-kit/ndk'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [base64Event, setBase64Event] = useState<string>('')
  const { t } = useTranslation()

  const router = useRouter()
  const params = useSearchParams()
  const {
    user: { identity }
  } = useLaWalletContext()

  const handleAcceptCardTransfer = () => {
    try {
      const event: NostrEvent = JSON.parse(atob(base64Event))
      buildCardTransferAcceptEvent(
        event.pubkey,
        event,
        identity.privateKey
      ).then(buildedEvent => {
        requestCardActivation(buildedEvent).then(res => {
          if (res) router.push('/settings/cards')
        })
      })
    } catch {
      return
    }
  }

  useEffect(() => {
    const paramEvent: string = params.get('event') ?? ''
    if (!paramEvent || !identity.privateKey) return

    setBase64Event(paramEvent)
  }, [identity.privateKey])

  return (
    <>
      <Navbar
        showBackPage={true}
        title={'Recibir tarjeta'}
        overrideBack="/settings/cards"
      />

      <Modal
        title={t('NEW_CARD')}
        isOpen={Boolean(base64Event.length)}
        onClose={() => null}
      >
        <Text>{t('DETECT_NEW_CARD')}</Text>
        <Flex direction="column" gap={4}>
          <Flex>
            <Button onClick={handleAcceptCardTransfer}>
              {t('ACTIVATE_CARD')}
            </Button>
          </Flex>
          <Flex>
            <Button
              variant="borderless"
              onClick={() => router.push('/settings/cards')}
            >
              {t('CANCEL')}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}

export default page