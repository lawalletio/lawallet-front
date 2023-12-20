import { useLaWalletContext } from '@/context/LaWalletContext'
import { NDKContext } from '@/context/NDKContext'
import {
  CardRequestResponse,
  buildAndBroadcastCardConfig,
  cardInfoRequest
} from '@/interceptors/card'
import { LaWalletKinds, buildCardInfoRequest, getTag } from '@/lib/events'
import { parseMultiNip04Event } from '@/lib/utils/nip04'
import { nowInSeconds, parseContent } from '@/lib/utils'
import {
  CardConfigPayload,
  CardDataPayload,
  CardStatus,
  ConfigTypes
} from '@/types/card'
import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk'
import { useContext, useEffect, useState } from 'react'
import { useSubscription } from './useSubscription'
import config from '@/constants/config'

export type CardConfigReturns = {
  cards: ICards
  toggleCardStatus: (uuid: string) => void
}

export type ICards = {
  data: CardDataPayload
  config: CardConfigPayload
  loadedAt: number
  loading: boolean
}

const useCardConfig = (): CardConfigReturns => {
  const [cards, setCards] = useState<ICards>({
    data: {},
    config: {} as CardConfigPayload,
    loadedAt: 0,
    loading: true
  })

  const { ndk } = useContext(NDKContext)
  const {
    user: { identity }
  } = useLaWalletContext()

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
      requestCardInfo(ConfigTypes.DATA.valueOf()).then(() => {
        requestCardInfo(ConfigTypes.CONFIG.valueOf()).then(
          async (res: CardRequestResponse | false) => {
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
      authors: [config.pubKeys.cardPubkey],
      '#d': [
        `${identity.hexpub}:${ConfigTypes.DATA.valueOf()}`,
        `${identity.hexpub}:${ConfigTypes.CONFIG.valueOf()}`
      ]
    })

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

        if (subkind === ConfigTypes.DATA)
          data = parseContent(parsedEncryptedData)
        if (subkind === ConfigTypes.CONFIG)
          config = parseContent(parsedEncryptedData)
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
          parseContent(parsedEncryptedData)
      }
    })
  }

  useEffect(() => {
    if (identity.hexpub) loadCardData()
  }, [identity.hexpub])

  useEffect(() => {
    if (events.length) processReceivedEvent()
  }, [events])

  return { cards, toggleCardStatus }
}

export default useCardConfig
