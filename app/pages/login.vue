<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"/>
    
    <div class="relative max-w-md w-full mx-4 space-y-8">
      <!-- Header Section -->
      <div class="text-center">
        <!-- Logo -->
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-6 float-animation">
          <UIcon name="i-heroicons-academic-cap" class="h-10 w-10 text-white" />
        </div>
        
        <!-- Title -->
        <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3">
          {{ t('login.title') }}
        </h2>
        
        <!-- Subtitle -->
        <div class="space-y-1">
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {{ t('brand.name') }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('brand.university') }}
          </p>
        </div>
      </div>

      <!-- Login Card -->
      <div class="enhanced-card">
        <div class="p-8 space-y-6">
          <!-- Welcome Message -->
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-hand-raised" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ t('login.welcomeTitle') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('login.welcomeDesc') }}
            </p>
          </div>

          <!-- Google Sign In Button -->
          <UButton 
            block 
            size="xl"
            :loading="loading" 
            class="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            icon="i-logos-google-icon"
            @click="handleGoogleSignIn()"
          >
          {{ t('login.buttonGoogle') }}
          </UButton>

          <!-- Security Notice -->
          <div class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-4">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-shield-check" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  {{ t('login.securityTitle') }}
                </p>
                <p class="text-blue-700 dark:text-blue-300">
                  {{ t('login.securityDesc') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  auth: {
    only: 'guest'
  }
})

const { t } = useI18n()
const loading = ref(false)
const toast = useToast()
const currentYear = new Date().getFullYear()
const { signIn } = useAuth()
const route = useRoute()
const localePath = useLocalePath()

const redirectTo = computed(() => {
  const redirect = route.query.redirect as string
  return localePath(redirect || '/')
})

const handleGoogleSignIn = async () => {
  loading.value = true
  
  try {
    await signIn.social({
      provider: 'google',
      fetchOptions: {
        onError: (error) => {
          console.error('Login error:', error)
          toast.add({
            title: t('login.toast.signInErrorTitle'),
            description: t('login.toast.signInErrorDesc'),
            color: 'error'
          })
          loading.value = false
        }
      },
      callbackURL: redirectTo.value
    })
  } catch (error) {
    console.error('Sign in error:', error)
    loading.value = false
  }
}
</script>