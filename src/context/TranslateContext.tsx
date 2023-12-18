import SpinnerView from '@/components/Loader/SpinnerView'
import {
  AvailableLanguages,
  DictionaryEntry,
  LanguagesList,
  ReplacementParams,
  defaultLocale
} from '@/translations/types'
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState
} from 'react'

interface IUseTranslation {
  lng: AvailableLanguages
  t: (key: string, params?: ReplacementParams) => string
  changeLanguage: (lng: AvailableLanguages) => void
}

const TranslateContext = createContext({} as IUseTranslation)

async function dynamicLoadMessages(locale: AvailableLanguages) {
  try {
    const dictionary = await import(
      `../translations/locales/${locale}/globals.json`
    )

    return dictionary
  } catch (error: unknown) {
    console.error(new Error(`Unable to load locale (${locale}): ${error}`))

    return false
  }
}

export function TranslateProvider({
  children,
  lng
}: {
  children: React.ReactNode
  lng: AvailableLanguages
}) {
  const [dictionary, setDictionary] = useState<DictionaryEntry>({})
  const translations = useTranslate(lng, dictionary)

  const loadDefaultLocale = useCallback(
    () => dynamicLoadMessages(defaultLocale).then(res => setDictionary(res)),
    []
  )

  useLayoutEffect(() => {
    dynamicLoadMessages(lng)
      .then(res => {
        res ? setDictionary(res) : loadDefaultLocale()
      })
      .catch(() => {
        loadDefaultLocale()
        throw new Error('Error loading translation')
      })
  }, [])

  return (
    <TranslateContext.Provider value={translations}>
      {!Object.keys(dictionary).length ? <SpinnerView /> : children}
    </TranslateContext.Provider>
  )
}

export const useTranslate = (
  usedLng: AvailableLanguages,
  dictionary: DictionaryEntry
): IUseTranslation => {
  const [lng, setLng] = useState(
    LanguagesList.includes(usedLng) ? usedLng : defaultLocale
  )

  const t = (key: string, params?: ReplacementParams): string => {
    let text: string = dictionary[key] ?? key

    if (params)
      Object.keys(params).map(key => {
        const strToReplace: string = `{{ ${key} }}`

        if (text.includes(strToReplace)) {
          text = text.replace(strToReplace, params[key])
        }
      })

    return text
  }

  const changeLanguage = (new_lng: AvailableLanguages) => {
    if (new_lng && LanguagesList.includes(new_lng)) {
      setLng(new_lng)

      const expire = new Date(Date.now() + 86400 * 365 * 1000).toUTCString()
      document.cookie = `localeTranslation=${new_lng}; expires=${expire}; path=/`
      window.location.reload()
    }
  }

  return { lng, t, changeLanguage }
}

export const useTranslation = () => {
  const context = useContext(TranslateContext)
  if (!context) {
    throw new Error('useTranslation must be used within TranslateProvider')
  }

  return context
}
