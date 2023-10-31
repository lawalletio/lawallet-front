export type AvailableCurrencies = 'SAT' | 'USD' | 'ARS'
export const CurrenciesList: AvailableCurrencies[] = ['SAT', 'USD', 'ARS']

type CurrencyMetadata = {
  locale: string
}

export const CurrenciesMetadata: Record<AvailableCurrencies, CurrencyMetadata> =
  {
    ARS: {
      locale: 'es-AR'
    },
    SAT: {
      locale: 'es-AR'
    },
    USD: {
      locale: 'en-US'
    }
  }

export type ConfigProps = {
  hideBalance: boolean
  currency: AvailableCurrencies
}

export const defaultConfig: ConfigProps = {
  hideBalance: false,
  currency: 'SAT'
}
