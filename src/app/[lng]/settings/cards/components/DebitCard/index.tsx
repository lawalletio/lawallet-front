import { GearIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import { useState } from 'react'

import Card from '@/components/Card'

import {
  ActionSheet,
  Button,
  Divider,
  Flex,
  LinkButton,
  QRCode,
  Text
} from '@/components/UI'
import { CardImage, ConfigCard } from './style'

import Countdown from '@/components/Countdown/Countdown'
import Pause from '@/components/Icons/Pause'
import Play from '@/components/Icons/Play'
import { useTranslation } from '@/context/TranslateContext'
import { CardPayload, CardStatus, Design } from '@/types/card'

interface ComponentProps {
  card: {
    uuid: string
    data: { design: Design }
    config: CardPayload | undefined
  }
  toggleCardStatus: (uuid: string) => void
  base64DonationCardEvent: (uuid: string) => Promise<string | undefined>
}

export default function Component(props: ComponentProps) {
  const { card, toggleCardStatus, base64DonationCardEvent } = props
  const { t } = useTranslation()
  const [handleSelected, setHandleSelected] = useState(false)

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
    const encodedDonationEvent: string | undefined =
      await base64DonationCardEvent(card.uuid)
    if (!encodedDonationEvent) return

    const absoluteURL = window.location
      ? window.location.origin
      : 'https://app.lawallet.ar'

    setQrInfo({
      value: `${absoluteURL}/settings/cards/donation?event=${encodedDonationEvent}`,
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
        title={card.config?.name || card.data.design.name}
        description={card.config?.description || card.data.design.name}
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
                name: card.config?.name ?? card.data.design.name
              })
            : t('CONFIRM_TRANSFER_CARD', {
                name: card.config?.name ?? card.data.design.name
              })
        }
      >
        {qrInfo.visible ? (
          <Flex direction="column" align="center">
            <QRCode size={250} value={qrInfo.value} showCopy={false} />
            <Divider y={12} />
            <Flex
              flex={1}
              direction="column"
              justify="space-between"
              align="center"
            >
              <Text size="small">{t('TIME_LEFT')}</Text>
              <Countdown seconds={180} />
            </Flex>
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
