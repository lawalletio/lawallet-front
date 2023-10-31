import { LaWalletContext } from '@/context/LaWalletContext'
import { AvailableLanguages, LanguagesList, dictionaries } from '@/translations'
import { useContext } from 'react'

export interface IUseTranslation {
  t: (key: string, params?: ReplacementParams) => string
  changeLanguage: (lng: AvailableLanguages) => void
}

export type ReplacementParams = Record<string, string>

export const useTranslation = (): IUseTranslation => {
  const { lng } = useContext(LaWalletContext)

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
      const expire = new Date(Date.now() + 86400 * 365 * 1000).toUTCString()

      document.cookie = `localeTranslation=${new_lng}; expires=${expire}; path=/`
      window.location.reload()
    }
  }

  return { t, changeLanguage }
}
