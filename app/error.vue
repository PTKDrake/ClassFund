<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"/>
    
    <div class="relative max-w-lg w-full mx-4 space-y-8">
      <!-- Error Icon -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl shadow-2xl mb-6 float-animation">
          <UIcon :name="errorIcon" class="h-12 w-12 text-white" />
        </div>
      </div>

      <!-- Error Card -->
      <div class="enhanced-card text-center">
        <div class="p-8 space-y-6">
          <!-- Error Code -->
          <div>
            <h1 class="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {{ error.statusCode }}
            </h1>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {{ errorTitle }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ error.statusMessage || t('error.unexpected') }}
            </p>
          </div>

          <!-- Error Details -->
          <div class="bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-700/30 rounded-xl p-4">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div class="text-left">
                <p class="font-medium text-red-800 dark:text-red-200 text-sm mb-1">
                  {{ t('common.error') }}
                </p>
                <p class="text-red-700 dark:text-red-300 text-sm">
                  {{ getErrorDescription(error.statusCode) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            
            <UButton
              to="/"
              variant="ghost"
              size="lg"
              icon="i-heroicons-home"
              class="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 justify-center"
            >
              {{ t('common.backHome') }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- Support Info -->
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{{ t('error.supportInfo') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NuxtError {
  statusCode: number
  statusMessage?: string
  message?: string
}

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return t('error.title.404')
    case 403:
      return t('error.title.403')
    case 500:
      return t('error.title.500')
    default:
      return t('error.title.default')
  }
})

const errorIcon = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'i-heroicons-document-magnifying-glass'
    case 403:
      return 'i-heroicons-shield-exclamation'
    case 500:
      return 'i-heroicons-server-stack'
    default:
      return 'i-heroicons-exclamation-triangle'
  }
})

const getErrorDescription = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return t('error.desc.404')
    case 403:
      return t('error.desc.403')
    case 500:
      return t('error.desc.500')
    default:
      return t('error.desc.default')
  }
}

const handleError = () => {
  clearError({ redirect: '/' })
}

// Meta tags for error page
useHead({
  title: t('meta.errorTitle', { code: props.error.statusCode })
})
</script>

