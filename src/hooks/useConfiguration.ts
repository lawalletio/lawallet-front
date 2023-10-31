import { AvailableCurrencies, ConfigProps, defaultConfig } from '@/types/config'
import { useEffect, useState } from 'react'

export type ConfigReturns = {
  props: ConfigProps
  loading: boolean
  toggleHideBalance: () => void
  changeCurrency: (currency: AvailableCurrencies) => void
}

const useConfiguration = (): ConfigReturns => {
  const [loading, setLoading] = useState<boolean>(true)
  const [props, setProps] = useState<ConfigProps>(defaultConfig)

  const saveConfiguration = (newConfig: ConfigProps) => {
    setProps(newConfig)
    localStorage.setItem('config', JSON.stringify(newConfig))
  }

  const toggleHideBalance = () =>
    saveConfiguration({
      ...props,
      hideBalance: !props.hideBalance
    })

  const changeCurrency = (currency: AvailableCurrencies) =>
    saveConfiguration({
      ...props,
      currency
    })
  const preloadConfig = () => {
    const storagedConfig: string | null = localStorage.getItem('config')
    if (!storagedConfig) {
      setLoading(false)
      return
    }

    const parsedConfig: ConfigProps = JSON.parse(storagedConfig)
    setProps(parsedConfig)
    setLoading(false)
  }

  useEffect(() => {
    preloadConfig()
  }, [])

  return { props, loading, toggleHideBalance, changeCurrency }
}

export default useConfiguration
