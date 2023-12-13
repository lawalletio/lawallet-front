import { NDKContext } from '@/context/NDKContext'
import { nowInSeconds } from '@/lib/utils'
import {
  NDKEvent,
  NDKFilter,
  NDKSubscription,
  NDKSubscriptionOptions
} from '@nostr-dev-kit/ndk'
import { useCallback, useContext, useEffect, useState } from 'react'

export interface IUseSubscription {
  subscription: NDKSubscription | undefined
  events: NDKEvent[]
}

export type SubscriptionProps = {
  filters: NDKFilter[]
  options: NDKSubscriptionOptions
  enabled: boolean
}

export const useSubscription = ({
  filters,
  options,
  enabled
}: SubscriptionProps) => {
  const { ndk } = useContext(NDKContext)

  const [subscription, setSubscription] = useState<NDKSubscription>()
  const [events, setEvents] = useState<NDKEvent[]>([])
  const [customSince, setCustomSince] = useState<number>(0)

  const startSubscription = useCallback(() => {
    if (ndk && enabled && !subscription) {
      console.log('sub started')
      const filtersToUse = customSince
        ? filters.map(filter => {
            return { ...filter, since: customSince }
          })
        : filters

      const newSubscription = ndk.subscribe(filtersToUse, options)
      newSubscription.on('event', async (event: NDKEvent) =>
        setEvents(prev => [...prev, event])
      )

      setSubscription(newSubscription)
      return
    }
  }, [ndk, enabled, subscription])

  const stopSubscription = () => {
    if (subscription) {
      subscription.stop()
      subscription.removeAllListeners()
      setSubscription(undefined)
    }
  }

  useEffect(() => {
    if (enabled && !subscription) {
      console.log('sub initialize')
      if (events.length && !customSince) setEvents([])
      startSubscription()
    }

    if (!enabled) stopSubscription()
  }, [enabled, subscription])

  const removeSubscription = () => {
    console.log('sub removed')
    setSubscription(undefined)
    setCustomSince(nowInSeconds())
  }

  useEffect(() => {
    // ndk.pool.on('relay:connect', startSubscription)
    ndk.pool.on('relay:disconnect', removeSubscription)

    return () => {
      // ndk.pool.removeListener('relay:connect', startSubscription)
      ndk.pool.removeListener('relay:disconnect', removeSubscription)
      ndk.pool.removeAllListeners()
    }
  }, [ndk])

  return {
    subscription,
    events
  }
}
