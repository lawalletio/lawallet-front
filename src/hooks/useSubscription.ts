import { NDKContext } from '@/context/NDKContext'
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

  const startSubscription = useCallback(() => {
    if (ndk && enabled && !subscription) {
      const newSubscription = ndk.subscribe(filters, options)
      newSubscription.on('event', async (event: NDKEvent) =>
        setEvents(prev => [...prev, event])
      )

      setSubscription(newSubscription)
      return
    }
  }, [ndk, enabled, subscription])

  const stopSubscription = useCallback(() => {
    if (subscription) {
      subscription.stop()
      subscription.removeAllListeners()
      setSubscription(undefined)
    }
  }, [subscription])

  useEffect(() => {
    if (enabled && !subscription) {
      if (events.length) setEvents([])
      startSubscription()
    }

    if (!enabled) stopSubscription()
  }, [enabled, subscription])

  return {
    subscription,
    events
  }
}
