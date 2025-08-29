<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
import type { locales as zodLocales  } from 'zod';
import { z  } from 'zod'

// Global meta configuration
const { t } = useI18n()
const { locale } = useI18n()

const updateZodLocale = (newLocale: string) => {
  const localeKey = newLocale.replace('-', '') as keyof typeof zodLocales
  if (z.locales[localeKey]) {
    z.config(z.locales[localeKey]())
  } else {
    console.warn(`Zod locale "${localeKey}" not found, falling back to English.`)
    z.config(z.locales.en())
  }
}

watchEffect(() => {
  updateZodLocale(locale.value)
})

useHead({
  title: t('meta.title'),
})

useSeoMeta({
  ogSiteName: t('meta.title'),
  ogImage: '/login_screenshot.jpeg'
})
</script>
