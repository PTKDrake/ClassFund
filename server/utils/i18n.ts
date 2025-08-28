import { getCookie, H3Event } from 'h3'
import fs from 'fs'
import path from 'path'

type Dictionary = Record<string, any>

const supportedLocales = ['vi', 'en'] as const
type SupportedLocale = typeof supportedLocales[number]

const dictionaries: Record<SupportedLocale, Dictionary> = {
  vi: {},
  en: {},
}

let initialized = false

function initDictionaries() {
  if (initialized) return
  for (const locale of supportedLocales) {
    try {
      const filePath = path.join(process.cwd(), 'i18n', `${locale}.json`)
      const raw = fs.readFileSync(filePath, 'utf8')
      dictionaries[locale] = JSON.parse(raw)
    } catch (error) {
      dictionaries[locale] = {}
    }
  }
  initialized = true
}

function getByPath(obj: Dictionary, key: string): string | undefined {
  return key.split('.').reduce<any>((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj)
}

function format(template: string, params?: Record<string, any>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const value = params[k]
    return value == null ? '' : String(value)
  })
}

export function getLocaleFromEvent(event?: H3Event): SupportedLocale {
  if (!event) return 'vi'
  const cookieLocale = getCookie(event, 'i18n_redirected')
  if (cookieLocale && supportedLocales.includes(cookieLocale as SupportedLocale)) {
    return cookieLocale as SupportedLocale
  }
  const accept = event.node.req.headers['accept-language']
  if (typeof accept === 'string') {
    const first = accept.split(',')[0]?.trim().toLowerCase()
    if (first?.startsWith('en')) return 'en'
    if (first?.startsWith('vi')) return 'vi'
  }
  return 'vi'
}

export function tServer(key: string, params?: Record<string, any>, event?: H3Event, fallbackLocale: SupportedLocale = 'vi'): string {
  initDictionaries()
  const locale = getLocaleFromEvent(event)
  const dict = dictionaries[locale] || dictionaries[fallbackLocale]
  const fallbackDict = dictionaries[fallbackLocale]
  const raw = (getByPath(dict, key) ?? getByPath(fallbackDict, key)) as string | undefined
  if (!raw) return key
  return format(raw, params)
}


