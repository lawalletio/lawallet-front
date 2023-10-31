import global_es from './locales/es/globals.json'
import global_en from './locales/en/globals.json'

export type AvailableLanguages = 'es' | 'en'

export const LanguagesList: AvailableLanguages[] = ['es', 'en']
export const defaultLocale: AvailableLanguages = 'es'

type DictionaryEntry = Record<string, string>

export const dictionaries: Record<AvailableLanguages, DictionaryEntry> = {
  en: global_en,
  es: global_es
}
