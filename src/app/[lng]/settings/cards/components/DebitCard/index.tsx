import { useState } from 'react'
import { GearIcon } from '@bitcoin-design/bitcoin-icons-react/filled'

import Card from '@/components/Card'

import {
  Button,
  Flex,
  Modal,
  ActionSheet,
  LinkButton,
  QRCode,
  Divider
} from '@/components/UI'
import { CardImage, ConfigCard } from './style'

import Pause from '@/components/Icons/Pause'
import Play from '@/components/Icons/Play'
import { CardPayload, CardStatus, Design } from '@/types/card'
import { buildCardTransferDonationEvent } from '@/lib/events'
import { useLaWalletContext } from '@/context/LaWalletContext'
import { useTranslation } from '@/context/TranslateContext'

interface ComponentProps {
  card: {
    uuid: string
    data: { design: Design }
    config: CardPayload | undefined
  }
  toggleCardStatus: (uuid: string) => void
}

export default function Component(props: ComponentProps) {
  const { card, toggleCardStatus } = props
  const { t } = useTranslation()
  const [handleSelected, setHandleSelected] = useState(false)

  const {
    user: { identity }
  } = useLaWalletContext()

  // ActionSheet
  const [showConfiguration, setShowConfiguration] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [qrInfo, setQrInfo] = useState({
    value: '',
    visible: false
  })

  const handleShowTransfer = () => {
    setShowConfiguration(false)
    setShowTransfer(true)
  }

  const handleDonateCard = async () => {
    const transferDonationEvent = await buildCardTransferDonationEvent(
      card.uuid,
      identity.privateKey
    )

    const encodedDonationEvent: string = btoa(
      JSON.stringify(transferDonationEvent)
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    setQrInfo({
      value: `https://app.lawallet.ar/settings/cards/donation?event=${encodedDonationEvent}`,
      visible: true
    })
  }

  const handleCloseActions = () => {
    setShowConfiguration(false)
    setShowTransfer(false)
    setQrInfo({
      value: '',
      visible: false
    })
  }

  return (
    <>
      <Flex
        justify={`${handleSelected ? 'end' : 'center'}`}
        align="center"
        gap={8}
      >
        <CardImage
          onClick={() => setHandleSelected(!handleSelected)}
          $isActive={handleSelected}
        >
          <Card
            data={card.data}
            active={card.config?.status === CardStatus.ENABLED}
          />
        </CardImage>

        {handleSelected && (
          <ConfigCard $isActive={handleSelected}>
            <Flex direction="column" flex={1} justify="center" gap={8}>
              {card.config?.status === CardStatus.ENABLED ? (
                <div>
                  <Button
                    onClick={() => toggleCardStatus(card.uuid)}
                    color="secondary"
                    variant="bezeled"
                  >
                    <Pause />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    onClick={() => toggleCardStatus(card.uuid)}
                    variant="bezeled"
                  >
                    <Play />
                  </Button>
                </div>
              )}
              <div>
                <Button
                  onClick={() => setShowConfiguration(true)}
                  variant="bezeledGray"
                >
                  <GearIcon />
                </Button>
              </div>
            </Flex>
          </ConfigCard>
        )}
      </Flex>

      {/* Menu actions by Card */}
      <ActionSheet
        isOpen={showConfiguration}
        onClose={handleCloseActions}
        title={card.config?.name || ''}
        description={card.config?.description || ''}
      >
        <LinkButton
          variant="bezeledGray"
          href={`/settings/cards/${card?.uuid}`}
        >
          {t('SETTINGS')}
        </LinkButton>
        <Button variant="bezeledGray" onClick={() => handleShowTransfer()}>
          {t('TRANSFER')}
        </Button>
      </ActionSheet>

      {/* Actions for confirm and show QR Code for Transfer Card */}
      <ActionSheet
        isOpen={!showConfiguration && showTransfer}
        onClose={handleCloseActions}
        title={t('TRANSFER')}
        description={
          qrInfo.visible
            ? t('SCAN_CODE_FOR_TRANSFER_CARD', {
                name: card.config?.name ?? ''
              })
            : t('CONFIRM_TRANSFER_CARD', {
                name: card.config?.name ?? ''
              })
        }
      >
        {qrInfo.visible ? (
          <Flex direction="column" align="center">
            <QRCode size={250} value={qrInfo.value} showCopy={false} />
            <Divider y={12} />
          </Flex>
        ) : (
          <Button
            color="secondary"
            variant="bezeledGray"
            onClick={handleDonateCard}
          >
            {t('CONFIRM')}
          </Button>
        )}
      </ActionSheet>
    </>
  )
}
