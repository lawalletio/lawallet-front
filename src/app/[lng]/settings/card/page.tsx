'use client'
import Container from '@/components/Layout/Container'
import { Text } from '@/components/UI'
import { LaWalletContext } from '@/context/LaWalletContext'
import { NDKContext } from '@/context/NDKContext'
import { cardInfoRequest } from '@/interceptors/card'
import { LaWalletKinds, buildCardInfoRequest, getTag } from '@/lib/events'
import { parseMultiNip04Event } from '@/lib/nip04'
import { CardConfigPayload, CardDataPayload, ConfigTypes } from '@/types/card'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { useContext, useEffect, useState } from 'react'

type ICards = {
  data: CardDataPayload
  config: Partial<CardConfigPayload>
  loading: boolean
}

const page = () => {
  const [cards, setCards] = useState<ICards>({
    data: {},
    config: {},
    loading: true
  })

  const { ndk } = useContext(NDKContext)
  const { identity } = useContext(LaWalletContext)

  const requestCardInfo = (type: string) => {
    const key: string = type === ConfigTypes.DATA ? 'data' : 'config'

    buildCardInfoRequest(`${type}-request`, identity.privateKey).then(
      CardDataRequestEvent => {
        cardInfoRequest(key, CardDataRequestEvent).then(eventResponse => {
          parseMultiNip04Event(
            eventResponse,
            identity.privateKey,
            identity.hexpub
          ).then(parsedEncryptedData => {
            if (parsedEncryptedData)
              setCards({
                ...cards,
                [key]: JSON.parse(parsedEncryptedData),
                loading: false
              })
          })
        })
      }
    )
  }

  const handleRequestData = () => {
    try {
      if (!Object.keys(cards.data).length)
        requestCardInfo(ConfigTypes.DATA.valueOf())

      if (!Object.keys(cards.config).length)
        requestCardInfo(ConfigTypes.CONFIG.valueOf())
    } catch (err) {
      console.log(err)
    }
  }

  const loadCardData = async () => {
    const fetchedEvents: Set<NDKEvent> = await ndk.fetchEvents({
      authors: [identity.hexpub],
      ids: [LaWalletKinds.PARAMETRIZED_REPLACEABLE.valueOf().toString()],
      '#d': [
        `${identity.hexpub}:${ConfigTypes.DATA.valueOf()}`,
        `${identity.hexpub}:${ConfigTypes.CONFIG.valueOf()}`
      ]
    })

    if (fetchedEvents.size) {
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
        config,
        loading: false
      })
    }
  }

  useEffect(() => {
    loadCardData()

    setTimeout(() => {
      if (cards.loading) setCards({ ...cards, loading: false })
    }, 2500)
  }, [ndk])

  return (
    <Container>
      <Text>{JSON.stringify(cards)}</Text>
      <button onClick={handleRequestData}>Request data</button>
    </Container>
  )
}

export default page
