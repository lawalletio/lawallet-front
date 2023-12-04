'use client'

import { useTranslation } from '@/hooks/useTranslations'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { Button, Divider, Flex, Heading, Modal, Text } from '@/components/UI'
import DebitCard from './components/DebitCard'

const ListCards = [
  {
    image: 'LaBitconf',
    name: 'LaBitconf',
    description: '',
    active: true
  },
  {
    image: 'Revolucion',
    name: 'Revolucion',
    description: '',
    active: false
  },
  {
    image: 'LunarPunk',
    name: 'LunarPunk',
    description: '',
    active: false
  },
  {
    image: 'HoneyBadger',
    name: 'HoneyBadger',
    description: '',
    active: true
  },
  {
    image: 'SolarPunk',
    name: 'SolarPunk',
    description: '',
    active: true
  },
  {
    image: 'ToTheMoon',
    name: 'ToTheMoon',
    description: '',
    active: false
  },
  {
    image: 'HalvingIsComing',
    name: 'HalvingIsComing',
    description: '',
    active: false
  },
  {
    image: 'LightningNetwork',
    name: 'LightningNetwork',
    description: '',
    active: false
  }
]

export default function Page() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar showBackPage={true}>
        <Flex align="center">
          <Heading as="h5">{t('MY_CARDS')}</Heading>
        </Flex>
      </Navbar>

      {/* <Container size="small">
        <Divider y={16} />
        <Flex direction="column">
          <Text isBold>LaBitconf</Text>
          <Text size="small">Descripcion.</Text>
        </Flex>
        <Divider y={16} />
      </Container> */}

      <Flex>
        <Container size="small">
          <Divider y={16} />
          <Flex direction="column" align="center" gap={16}>
            {ListCards.map((card, index) => (
              <DebitCard card={card} active={card.active} key={index} />
            ))}
          </Flex>
          <Divider y={16} />
        </Container>
      </Flex>

      <Modal title="Nueva tarjeta" isOpen={true} onClose={() => null}>
        <Text>
          Hay una nueva tarjeta detectada llamada LaBitconf, ¿estás seguro de
          querer agregarla a tu listado?
        </Text>
        <Flex direction="column" gap={4}>
          <Flex>
            <Button onClick={() => null}>Agregar</Button>
          </Flex>
          <Flex>
            <Button variant="borderless" onClick={() => null}>
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}
