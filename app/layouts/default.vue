<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Enhanced Navigation with gradient background -->
    <nav class="glass-effect sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 sm:h-20 lg:h-25">
          <!-- Logo/Brand section with enhanced styling -->
          <NuxtLink to="/" class="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 hover:opacity-80 transition-opacity duration-200">
            <div class="bg-gradient-to-r from-amber-400 to-yellow-400 aspect-square rounded-xl shadow-lg h-8 sm:h-10 lg:h-12">
              <img src="/logo.png" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" >
            </div>
            <div class="hidden sm:block">
              <h1 class="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {{ t('brand.name') }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">{{ t('brand.university') }}</p>
            </div>
          </NuxtLink>

          <div class="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            <!-- Theme Toggle Button -->
            <UButton
variant="subtle" class="rounded-full aspect-square" size="sm" :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              @click="toggleColorMode"/>

            <UDropdownMenu
v-if="loggedIn" :items="userMenuItems" :content="{
              align: 'end',
              side: 'bottom',
              sideOffset: 8
            }" :ui="{ content: 'w-40' }">
              <UButton
:avatar="{
                src: currentUser?.image || undefined,
              }" variant="ghost" color="neutral" size="xl" 
                class="text-xs sm:text-sm max-w-[200px]"
                :label="userDisplayName"/>
            </UDropdownMenu>
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
to="https://github.com/ptkdrake/classfund" target="_blank" variant="ghost" size="sm"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
              <span class="ml-2 hidden sm:inline">{{ t('footer.github') }}</span>
            </UButton>

            <UButton
to="https://facebook.com/ptkdrake.real" target="_blank" variant="ghost" size="sm"
              class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
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

<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const { loggedIn, user: currentUser, signOut } = useAuth()

// Color mode functionality
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const userMenuItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: t('layout.logout'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect() { signOut({ redirectTo: '/login' }) }
    }
  ]
])

if (currentUser.value?.role === 'admin') {
  userMenuItems.value = [
    [
      {
        label: t('layout.admin'),
        icon: 'i-heroicons-users',
        color: 'secondary',
        onSelect() { navigateTo('/admin') }
      },
      {
        label: t('settings.title'),
        icon: 'i-heroicons-cog-6-tooth',
        color: 'secondary',
        onSelect() { navigateTo('/admin/settings') }
      }
    ],
    [
      {
        label: t('layout.logout'),
        icon: 'i-heroicons-arrow-right-on-rectangle',
        color: 'error',
        onSelect() { signOut({ redirectTo: '/login' }) }
      }
    ]
  ]
}

// Responsive user display name
const userDisplayName = computed(() => {
  if (!currentUser.value) return ''
  
  // For mobile screens, show only first name or empty
  const fullName = `${currentUser.value.lastName || ''} ${currentUser.value.firstName || ''}`
  return fullName.trim()
})

// Current year for footer
const currentYear = new Date().getFullYear()
</script>