import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import {
  AvailableLanguages,
  LanguagesList,
  defaultLocale
} from '@/translations'

const cookieName = 'localeTranslation'

function getLocale(request: NextRequest): string {
  if (request.cookies.has(cookieName)) {
    const lng = request.cookies.get(cookieName)?.value
    if (lng && LanguagesList.includes(lng as AvailableLanguages)) return lng
  }

  const headers = new Headers(request.headers)
  const acceptLanguage = headers.get('accept-language')

  if (acceptLanguage)
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'))

  const headersObject = Object.fromEntries(headers.entries())
  const languages = new Negotiator({ headers: headersObject }).languages()
  return match(languages, LanguagesList, defaultLocale)
}

export function middleware(request: NextRequest) {
  const locale = getLocale(request) ?? defaultLocale
  const pathname = request.nextUrl.pathname

  const newUrl = new URL(`/${locale}${pathname}`, request.nextUrl)
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|manifest.json|sw.js|workbox-*.js|_next/static|icons/|media/|cards/).*)'
  ]
}
