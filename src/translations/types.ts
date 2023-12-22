export type AvailableLanguages = 'es' | 'en'

export const LanguagesList: AvailableLanguages[] = ['es', 'en']
export const defaultLocale: AvailableLanguages = 'es'

export type DictionaryEntry = Record<string, string>

export type ReplacementParams = Record<string, string>
