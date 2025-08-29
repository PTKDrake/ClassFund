// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'
import { generateRuntimeConfig } from './server/utils/runtimeConfig'
import { tServer } from './server/utils/i18n'

console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/eslint',
    '@sentry/nuxt/module',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@sentry/nuxt/module'
  ],

  css: ['~/assets/css/main.css'],
  icon: {
    serverBundle: false,
    clientBundle: {
      scan: {
        globInclude: ['**\/*.{vue,jsx,tsx,md,mdc,mdx}', 'app/**/*.ts']
      }
    }
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'mightyempire',
      project: 'classfund',
    },
  },

  sourcemap: {
    client: 'hidden',
  },

  i18n: {
    vueI18n: '~/i18n/i18n.config.ts',
    locales: [
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' }
    ],
    defaultLocale: 'vi'
  },
  runtimeConfig: generateRuntimeConfig(),
  sitemap: {
    exclude: [
      '/admin/**',
      '/403',
      '/404'
    ]
  },
  robots: {
    disallow: [
      '/admin',
    ]
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5.0, minimum-scale=1.0',
      meta: [
        { name: 'apple-mobile-web-app-title', content: process.env.NUXT_APP_NAME },
        { name: 'description', content: tServer('meta.description') },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '96x96' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.png' },
      ]
    }
  },
  nitro: {
    preset: process.env.NUXT_NITRO_PRESET,
    rollupConfig: {
      external: process.env.NUXT_NITRO_PRESET != 'node-server' ? ['pg-native'] : undefined
    }
  },
  $production: {
    build: {
      transpile: ['zod']
    }
  }
})