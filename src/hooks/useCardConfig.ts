import { useLaWalletContext } from '@/context/LaWalletContext'
import { buildAndBroadcastCardConfig } from '@/interceptors/card'
import { LaWalletKinds, getTag } from '@/lib/events'
import config from '@/constants/config'
import { parseMultiNip04Event } from '@/lib/utils/nip04'
import { parseContent } from '@/lib/utils'
import {
  CardConfigPayload,
  CardDataPayload,
  CardStatus,
  ConfigTypes
} from '@/types/card'
import {
  NDKEvent,
  NDKKind,
  NDKSubscriptionCacheUsage
} from '@nostr-dev-kit/ndk'
import { useEffect, useState } from 'react'
import { useSubscription } from './useSubscription'

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
        authors: [config.pubKeys.cardPubkey],
        since: cards.loadedAt
      }
    ],
    options: {
      closeOnEose: false,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    },
    enabled: true
  })

  const toggleCardStatus = (uuid: string) => {
    console.info('START TOGGLE!')
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

  const processReceivedEvent = async (events: NDKEvent[]) => {
    console.info('processReceivedEvent')
    const latestEvent = events.sort((a, b) => b.created_at! - a.created_at!)[0]
    const nostrEv = await latestEvent.toNostrEvent()

    const parsedEncryptedData = await parseMultiNip04Event(
      nostrEv,
      identity.privateKey,
      identity.hexpub
    )

    const subkind: string = getTag(nostrEv.tags, 't')

    console.info('parsedEncryptedData:')
    console.dir(parsedEncryptedData)
    setCards(prev => {
      return {
        ...prev,
        loadedAt: nostrEv.created_at + 1,
        [subkind === ConfigTypes.DATA ? 'data' : 'config']:
          parseContent(parsedEncryptedData),
        loading: false
      }
    })
  }

  useEffect(() => {
    if (!events.length) {
      return
    }
    processReceivedEvent(events)
  }, [events])

  return { cards, toggleCardStatus }
}

export default useCardConfig
