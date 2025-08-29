<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Enhanced Navigation with gradient background -->
    <nav class="glass-effect sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo/Brand section with enhanced styling -->
          <NuxtLink to="/" class="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200">
            <div class="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl shadow-lg">
              <img src="/logo.png" alt="Logo" class="h-16 w-16" />
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ t('brand.name') }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('brand.university') }}</p>
            </div>
          </NuxtLink>

          <div class="flex items-center space-x-3">
            <!-- Theme Toggle Button -->
            <UButton @click="toggleColorMode" variant="neutral"
              class="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl">
              <ClientOnly>
                <UIcon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" />
                <template #fallback>
                  <UIcon name="i-heroicons-moon" />
                </template>
              </ClientOnly>
            </UButton>

            <!-- User info with enhanced styling -->
            <div class="hidden md:flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-3 py-2"
              v-if="loggedIn">
              <div
                class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">
                  {{ (currentUser?.firstName?.[0] || '').toUpperCase() }}{{ (currentUser?.lastName?.[0] ||
                    '').toUpperCase() }}
                </span>
              </div>
              <div class="text-sm">
                <div class="font-medium text-gray-900 dark:text-gray-100">
                  {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                </div>
              </div>
            </div>

            <!-- Admin button with enhanced styling -->
            <UButton v-if="currentUser?.role === 'admin'" to="/admin"
              class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              icon="i-heroicons-cog-6-tooth" size="sm">
              <span class="hidden sm:inline">{{ t('layout.admin') }}</span>
            </UButton>

            <!-- Logout button -->
            <UButton @click="signOut({ redirectTo: '/login' })" variant="ghost" size="sm"
              icon="i-heroicons-arrow-right-on-rectangle"
              class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
              v-if="loggedIn">
              <span class="hidden sm:inline">{{ t('layout.logout') }}</span>
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Revolution Anniversary Banner -->
    <RevolutionBanner />

    <!-- Enhanced main content area -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="min-h-[calc(100vh-12rem)]">
        <slot />
      </div>
    </main>

    <!-- Footer with enhanced styling -->
    <footer
      class="mt-auto border-t border-gray-200/30 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4">
          <!-- Social Links -->
          <div class="flex justify-center items-center space-x-6">
            <UButton 
              to="https://github.com/ptkdrake/classfund" 
              target="_blank" 
              variant="ghost" 
              size="sm"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
              <span class="ml-2 hidden sm:inline">{{ t('footer.github') }}</span>
            </UButton>
            
            <UButton 
              to="https://facebook.com/ptkdrake.real" 
              target="_blank" 
              variant="ghost" 
              size="sm"
              class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5" />
              <span class="ml-2 hidden sm:inline">{{ t('footer.facebook') }}</span>
            </UButton>
          </div>
          
          <!-- Copyright -->
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {{ currentYear }} {{ t('brand.copyright') }}</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { loggedIn, user: currentUser, signOut } = useAuth()

// Color mode functionality
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Current year for footer
const currentYear = new Date().getFullYear()
</script>