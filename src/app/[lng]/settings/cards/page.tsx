'use client'

import { useTranslation } from '@/hooks/useTranslations'

import Container from '@/components/Layout/Container'
import Navbar from '@/components/Layout/Navbar'
import { MainLoader } from '@/components/Loader/Loader'
import { Divider, Flex, Text } from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import { NDKContext } from '@/context/NDKContext'
import {
  CardRequestResponse,
  buildAndBroadcastCardConfig,
  cardInfoRequest
} from '@/interceptors/card'
import { LaWalletKinds, buildCardInfoRequest, getTag } from '@/lib/events'
import { parseMultiNip04Event } from '@/lib/nip04'
import {
  CardConfigPayload,
  CardDataPayload,
  CardStatus,
  ConfigTypes
} from '@/types/card'
import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk'
import { useContext, useEffect, useState } from 'react'
import DebitCard from './components/DebitCard'
import { useSubscription } from '@/hooks/useSubscription'
import { nowInSeconds } from '@/lib/utils'

export type ICards = {
  data: CardDataPayload
  config: CardConfigPayload
  loadedAt: number
  loading: boolean
}

export default function Page() {
  const { t } = useTranslation()

  const [cards, setCards] = useState<ICards>({
    data: {},
    config: {} as CardConfigPayload,
    loadedAt: 0,
    loading: true
  })

  const { ndk } = useContext(NDKContext)
  const { identity } = useContext(LaWalletContext)

  const { events } = useSubscription({
    filters: [
      {
        kinds: [LaWalletKinds.PARAMETRIZED_REPLACEABLE.valueOf() as NDKKind],
        '#d': [
          `${identity.hexpub}:${ConfigTypes.DATA.valueOf()}`,
          `${identity.hexpub}:${ConfigTypes.CONFIG.valueOf()}`
        ],
        since: cards.loadedAt
      }
    ],
    options: {},
    enabled: !cards.loading
  })

  const requestCardInfo = (
    type: string
  ): Promise<CardRequestResponse | false> => {
    const key: string = type === ConfigTypes.DATA ? 'data' : 'config'

    return buildCardInfoRequest(`${type}-request`, identity.privateKey)
      .then(CardDataRequestEvent =>
        cardInfoRequest(key, CardDataRequestEvent).then(
          (response: CardRequestResponse) => {
            if (!Object.keys(response).length) return false

            setCards(prev => {
              return {
                ...prev,
                [key]: response,
                loadedAt: nowInSeconds(),
                loading: false
              }
            })

            return response
          }
        )
      )
      .catch(() => false)
  }

  const handleRequestData = () => {
    try {
      requestCardInfo(ConfigTypes.DATA.valueOf()).then(res => {
        console.log(res)
        requestCardInfo(ConfigTypes.CONFIG.valueOf()).then(
          async (res: CardRequestResponse | false) => {
            console.log(res)
            if (res)
              buildAndBroadcastCardConfig(
                res as CardConfigPayload,
                identity.privateKey
              )
          }
        )
      })
    } catch (err) {
      console.log('error al solicitar la información de card')
    }
  }

  const loadCardData = async () => {
    const fetchedEvents: Set<NDKEvent> = await ndk.fetchEvents({
      kinds: [LaWalletKinds.PARAMETRIZED_REPLACEABLE.valueOf() as NDKKind],
      '#d': [
        `${identity.hexpub}:${ConfigTypes.DATA.valueOf()}`,
        `${identity.hexpub}:${ConfigTypes.CONFIG.valueOf()}`
      ]
    })

    console.log(fetchedEvents)

    if (fetchedEvents.size === 2) {
      let config: Partial<CardConfigPayload> = {},
        data: CardDataPayload = {}

      for (const event of fetchedEvents) {
        const nostrEv = await event.toNostrEvent()
        const parsedEncryptedData = await parseMultiNip04Event(
          nostrEv,
          identity.privateKey,
          identity.hexpub
        )

        const subkind: string = getTag(nostrEv.tags, 't')

        if (subkind === ConfigTypes.DATA) data = JSON.parse(parsedEncryptedData)
        if (subkind === ConfigTypes.CONFIG)
          config = JSON.parse(parsedEncryptedData)
      }

      setCards({
        data,
        config: config as CardConfigPayload,
        loadedAt: nowInSeconds(),
        loading: false
      })
    } else {
      handleRequestData()
    }
  }

  const toggleCardStatus = (uuid: string) => {
    const new_card_config = {
      ...cards.config,
      cards: {
        ...cards.config.cards,
        [uuid.toString()]: {
          ...cards.config.cards?.[uuid],
          status:
            cards.config.cards?.[uuid]?.status === CardStatus.ENABLED
              ? CardStatus.DISABLED
              : CardStatus.ENABLED
        }
      }
    }

    buildAndBroadcastCardConfig(new_card_config, identity.privateKey)
  }

  const processReceivedEvent = async () => {
    const latestEvent = events.sort((a, b) => b.created_at! - a.created_at!)[0]
    const nostrEv = await latestEvent.toNostrEvent()

    const parsedEncryptedData = await parseMultiNip04Event(
      nostrEv,
      identity.privateKey,
      identity.hexpub
    )

    const subkind: string = getTag(nostrEv.tags, 't')

    setCards(prev => {
      return {
        ...prev,
        loadedAt: nostrEv.created_at + 1,
        [subkind === ConfigTypes.DATA ? 'data' : 'config']:
          JSON.parse(parsedEncryptedData)
      }
    })
  }

  useEffect(() => {
    if (identity.hexpub) loadCardData()
  }, [ndk, identity.hexpub])

  useEffect(() => {
    if (events.length) processReceivedEvent()
  }, [events])

  return (
    <>
      <Navbar showBackPage={true} title={t('MY_CARDS')} />

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
          {cards.loading ? (
            <MainLoader />
          ) : Object.keys(cards.data).length ? (
            <Flex direction="column" align="center" gap={16}>
              {Object.entries(cards.data).map(([key, value]) => {
                return (
                  <DebitCard
                    card={{
                      uuid: key,
                      data: value,
                      config: cards.config.cards?.[key]
                    }}
                    toggleCardStatus={toggleCardStatus}
                    key={key}
                  />
                )
              })}
            </Flex>
          ) : (
            <Text>{t('NO_HAVE_CARDS')}</Text>
          )}
          <Divider y={16} />
        </Container>
      </Flex>

      {/* <Modal title="Nueva tarjeta" isOpen={true} onClose={() => null}>
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
      </Modal> */}
    </>
  )
}
