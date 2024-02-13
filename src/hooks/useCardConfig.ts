import { useLaWalletContext } from '@/context/LaWalletContext'
import { buildAndBroadcastCardConfig } from '@/interceptors/card'
import { LaWalletKinds, getTag } from '@/lib/events'
import config from '@/constants/config'
import { parseMultiNip04Event } from '@/lib/utils/nip04'
import { parseContent } from '@/lib/utils'
import {
  CardConfigPayload,
  CardDataPayload,
  CardPayload,
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
  cardsData: CardDataPayload
  cardsConfig: CardConfigPayload
  loadInfo: CardLoadingType
  toggleCardStatus: (uuid: string) => Promise<boolean>
  updateCardConfig: (uuid: string, config: CardPayload) => Promise<boolean>
}

type CardLoadingType = {
  loadedAt: number
  loading: boolean
}

const useCardConfig = (): CardConfigReturns => {
  const [cardsData, setCardsData] = useState<CardDataPayload>({})
  const [cardsConfig, setCardsConfig] = useState<CardConfigPayload>(
    {} as CardConfigPayload
  )
  const [loadInfo, setLoadInfo] = useState<CardLoadingType>({
    loadedAt: 0,
    loading: true
  })

  const {
    user: { identity }
  } = useLaWalletContext()

  const { subscription } = useSubscription({
    filters: [
      {
        kinds: [LaWalletKinds.PARAMETRIZED_REPLACEABLE.valueOf() as NDKKind],
        '#d': [
          `${identity.hexpub}:${ConfigTypes.DATA.valueOf()}`,
          `${identity.hexpub}:${ConfigTypes.CONFIG.valueOf()}`
        ],
        authors: [config.pubKeys.cardPubkey],
        since: loadInfo.loadedAt
      }
    ],
    options: {
      closeOnEose: false,
      cacheUsage: NDKSubscriptionCacheUsage.PARALLEL
    },
    enabled: true
  })

  const toggleCardStatus = async (uuid: string): Promise<boolean> => {
    if (!cardsConfig.cards?.[uuid]) return false

    const new_card_config = {
      ...cardsConfig,
      cards: {
        ...cardsConfig.cards,
        [uuid.toString()]: {
          ...cardsConfig.cards[uuid],
          status:
            cardsConfig.cards[uuid].status === CardStatus.ENABLED
              ? CardStatus.DISABLED
              : CardStatus.ENABLED
        }
      }
    }

    return buildAndBroadcastCardConfig(new_card_config, identity.privateKey)
  }

  const updateCardConfig = async (
    uuid: string,
    config: CardPayload
  ): Promise<boolean> => {
    if (!cardsConfig.cards?.[uuid]) return false

    const new_card_config = {
      ...cardsConfig,
      cards: {
        ...cardsConfig.cards,
        [uuid.toString()]: {
          ...config,
          name: config.name ?? cardsData[uuid].design.name,
          description: config.description ?? cardsData[uuid].design.description
        }
      }
    }

    return buildAndBroadcastCardConfig(new_card_config, identity.privateKey)
  }

  const processReceivedEvent = async (event: NDKEvent) => {
    const nostrEv = await event.toNostrEvent()

    const decryptedData = await parseMultiNip04Event(
      nostrEv,
      identity.privateKey,
      identity.hexpub
    )

    const parsedDecryptedData = parseContent(decryptedData)

    const subkind: string = getTag(nostrEv.tags, 't')

    if (subkind === ConfigTypes.DATA) {
      setCardsData(parsedDecryptedData)
    } else if (subkind === ConfigTypes.CONFIG) {
      setCardsConfig(parsedDecryptedData)
    }

    if (loadInfo.loading)
      setLoadInfo({ loadedAt: nostrEv.created_at + 1, loading: false })
  }

  useEffect(() => {
    subscription?.on('event', data => {
      processReceivedEvent(data)
    })
  }, [subscription])

  useEffect(() => {
    setTimeout(() => {
      if (loadInfo.loading)
        setLoadInfo(prev => {
          return { ...prev, loading: false }
        })
    }, 2500)
  }, [])

  return {
    cardsData,
    cardsConfig,
    loadInfo,
    toggleCardStatus,
    updateCardConfig
  }
}

export default useCardConfig
