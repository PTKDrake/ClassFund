<template>
  <section class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
    <!-- Background pattern for visual interest -->
    <div class="absolute inset-0 bg-gradient-to-r from-red-100/20 to-yellow-100/20 dark:from-red-900/10 dark:to-yellow-900/10"/>
    <div class="absolute inset-0 bg-white/40 dark:bg-black/40"/>
    
    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Text Content -->
        <div class="text-center lg:text-left space-y-6">
                     <div class="space-y-4">
             <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight text-center">
               <template v-for="(line, index) in titleLines" :key="index">
                 <span class="block">{{ line }}</span>
               </template>
             </h1>
            <div class="w-24 h-1 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto lg:mx-0 rounded-full"/>
            <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {{ t('banner.revolution.description') }}
            </p>
          </div>
          
          <!-- Call to action or decorative element -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4">
            <div class="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <UIcon name="i-heroicons-star-solid" class="w-5 h-5" />
              <span class="text-sm font-medium">{{ t('banner.revolution.years') }}</span>
              <UIcon name="i-heroicons-star-solid" class="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <!-- Image Container -->
        <div class="flex justify-center lg:justify-end">
          <div class="relative group">
            <!-- Placeholder for banner image -->
            <div class="w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[2426/2162] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <img 
                v-if="bannerImageExists"
                src="/revolution-banner.png" 
                :alt="t('banner.revolution.imageAlt')"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              >
              <!-- Fallback placeholder -->
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100/40 to-yellow-100/40 dark:from-red-900/20 dark:to-yellow-900/20">
                <div class="text-center space-y-3 p-8">
                  <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p class="text-gray-600 dark:text-gray-400 text-sm">{{ t('banner.revolution.imagePlaceholder') }}</p>
                </div>
              </div>
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 dark:bg-yellow-400 rounded-full animate-pulse"/>
            <div class="absolute -bottom-4 -left-4 w-6 h-6 bg-red-500 dark:bg-red-400 rounded-full animate-pulse delay-1000"/>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Decorative bottom border -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 dark:from-red-600 dark:via-yellow-500 dark:to-red-600"/>
  </section>
</template>

<script setup>
const { t } = useI18n()

// Split title into lines for proper display
const titleLines = computed(() => {
  return t('banner.revolution.title').split('\n')
})

// Check if banner image exists (you can implement this check or just set to false for now)
const bannerImageExists = ref(false)

// You could add a method to check if the image file exists
onMounted(async () => {
  try {
    const response = await fetch('/revolution-banner.png', { method: 'HEAD' })
    bannerImageExists.value = response.ok
  } catch {
    bannerImageExists.value = false
  }
})
</script>

<style scoped>
/* Additional custom styles if needed */
.aspect-\[2426\/2162\] {
  aspect-ratio: 2426 / 2162;
}
</style>
