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
  const [handleSelected, setHandleSelected] = useState(false)

  // ActionSheet
  const [showConfiguration, setShowConfiguration] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)

  const handleTransferCard = () => {
    setShowConfiguration(false)
    setShowTransfer(true)
  }

  const handleCloseActions = () => {
    setShowConfiguration(false)
    setShowTransfer(false)
    setShowQrCode(false)
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
        title={card?.data?.design?.name || ''}
        description={card?.data?.design?.description || ''}
      >
        <LinkButton
          variant="bezeledGray"
          href={`/settings/cards/${card?.uuid}`}
        >
          Configuracion
        </LinkButton>
        <Button variant="bezeledGray" onClick={() => handleTransferCard()}>
          Transferir
        </Button>
      </ActionSheet>

      {/* Actions for confirm and show QR Code for Transfer Card */}
      <ActionSheet
        isOpen={!showConfiguration && showTransfer}
        onClose={handleCloseActions}
        title={'Transferir'}
        description={
          showQrCode
            ? `Escanea el codigo QR para transferir la tarjeta ${card.data.design.name}.`
            : `Esta seguro de querer transferir la tarjeta ${card.data.design.name}?`
        }
      >
        {showQrCode ? (
          <Flex direction="column" align="center">
            <QRCode size={250} value="algo" showCopy={false} />
            <Divider y={12} />
          </Flex>
        ) : (
          <Button
            color="secondary"
            variant="bezeledGray"
            onClick={() => setShowQrCode(true)}
          >
            Confirmar
          </Button>
        )}
      </ActionSheet>
    </>
  )
}
