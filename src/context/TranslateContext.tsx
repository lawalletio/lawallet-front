import {
  AvailableLanguages,
  LanguagesList,
  defaultLocale,
  dictionaries
} from '@/translations'
import { createContext, useContext, useState } from 'react'

interface IUseTranslation {
  lng: AvailableLanguages
  t: (key: string, params?: ReplacementParams) => string
  changeLanguage: (lng: AvailableLanguages) => void
}

export type ReplacementParams = Record<string, string>

const TranslateContext = createContext({} as IUseTranslation)

export function TranslateProvider({
  children,
  lng
}: {
  children: React.ReactNode
  lng: AvailableLanguages
}) {
  const translations = useTranslate(lng)

  return (
    <TranslateContext.Provider value={translations}>
      {children}
    </TranslateContext.Provider>
  )
}

export const useTranslate = (usedLng: AvailableLanguages): IUseTranslation => {
  const [lng, setLng] = useState(
    LanguagesList.includes(usedLng) ? usedLng : defaultLocale
  )

  const t = (key: string, params?: ReplacementParams): string => {
    let text: string = dictionaries[lng][key] ?? key

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
  return useContext(TranslateContext)
}
