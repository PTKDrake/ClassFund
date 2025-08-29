<template>
  <div class="space-y-8">
    <!-- Enhanced Hero Section -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center space-x-3 mb-6">
        <div class="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl float-animation">
          <UIcon name="i-heroicons-banknotes" class="h-10 w-10 text-white" />
        </div>
      </div>

      <h1
        class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
        {{ t('home.hero.title') }}
      </h1>

      <ClientOnly>
        <div
          class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
          <p class="text-lg text-gray-700 dark:text-gray-300 font-medium">
            {{ t('home.hero.welcome', { lastName: currentUser?.lastName, firstName: currentUser?.firstName }) }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ t('home.hero.subtitle') }}
          </p>
        </div>
        <template #fallback>
          <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-64 mb-2"/>
            <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-48"/>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Main Status Card with Enhanced Styling -->
    <div class="enhanced-card">
      <div class="p-8">
        <ClientOnly>
          <!-- Loading State -->
          <div v-if="!currentUser || pending" class="text-center py-12">
            <div class="enhanced-spinner mx-auto mb-6"/>
            <div class="space-y-2">
              <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('home.loading.title') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('home.loading.subtitle') }}</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div
              class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-10 w-10 text-red-500" />
            </div>
            <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-3">
              {{ t('home.error.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('home.error.subtitle') }}
            </p>
            <div
              class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-4 max-w-md mx-auto">
              <p class="text-sm text-red-800 dark:text-red-200">
                {{ t('home.error.hint') }}
              </p>
            </div>
          </div>

          <!-- Not Found State -->
          <div v-else-if="!studentData.found" class="text-center py-12">
            <div
              class="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-user-plus" class="h-10 w-10 text-blue-500" />
            </div>
            <h3 class="text-xl font-bold text-blue-700 dark:text-blue-400 mb-3">
              {{ t('home.notFound.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ t('home.notFound.subtitle') }}
            </p>

            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6 max-w-lg mx-auto">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <UIcon name="i-heroicons-information-circle" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="text-left">
                  <p class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    {{ t('home.notFound.infoTitle') }}
                  </p>
                  <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    {{ t('home.notFound.infoDesc') }}
                  </p>
                  <div class="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 text-sm">
                    <p class="font-medium text-blue-800 dark:text-blue-200">{{ t('home.notFound.yourInfoTitle') }}</p>
                    <p class="text-blue-700 dark:text-blue-300 mt-1">
                      👤 {{ currentUser?.lastName }} {{ currentUser?.firstName }}
                    </p>
                    <p class="text-blue-700 dark:text-blue-300">
                      📧 {{ currentUser?.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Success State - Paid -->
          <div v-else-if="studentData.student?.hasPaid" class="text-center py-12">
            <div
              class="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
              <UIcon name="i-heroicons-check-circle" class="h-14 w-14 text-green-500" />
            </div>
            <h3 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
              {{ t('home.paid.title') }}
            </h3>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {{ t('home.paid.subtitle') }}
            </p>

            <div
              class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200/50 dark:border-green-700/30 rounded-xl p-6 max-w-md mx-auto">
              <div class="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                <UIcon name="i-heroicons-currency-dollar" class="h-5 w-5" />
                <span class="font-semibold">{{ t('home.paid.amount', { amount: '276,000 VNĐ' }) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment State - Optimized Layout -->
          <div v-else class="space-y-6">
            <!-- Payment Header -->
            <div class="text-center">
              <div
                class="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-qr-code" class="h-8 w-8 text-orange-500" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {{ t('home.payment.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ t('home.payment.subtitle') }}
              </p>
            </div>

            <!-- Desktop Layout: QR + Details Side by Side -->
            <div class="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start space-y-6 lg:space-y-0">

              <!-- QR Code Section -->
              <div class="flex flex-col items-center space-y-4">
                <div
                  class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div class="qr-container mx-auto rounded-xl shadow-md overflow-hidden">
                    <!-- Loading State -->
                    <div
v-if="isGeneratingQR"
                      class="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                      <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"/>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('home.qr.loading') }}</p>
                      </div>
                    </div>

                    <!-- QR Code Image -->
                    <img
v-else-if="qrCodeUrl && !qrError" :src="qrCodeUrl" :alt="t('home.qr.alt')"
                      class="w-full h-full object-cover" @error="onImageError" >

                    <!-- Error State -->
                    <div
v-else-if="qrError"
                      class="w-full h-full flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                      <div class="text-center p-4">
                        <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p class="text-sm text-red-600 dark:text-red-400">{{ t('home.qr.error') }}</p>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <div class="text-center p-4">
                        <UIcon name="i-heroicons-qr-code" class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('home.qr.empty') }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Download Button -->
                <div class="space-y-3 w-full max-w-xs">
                  <UButton
variant="outline" size="lg" icon="i-heroicons-arrow-down-tray" class="w-full"
                    @click="downloadQRCode">
                    {{ t('home.actions.downloadQR') }}
                  </UButton>

                  <!-- Refresh QR Button for debugging -->
                  <UButton
variant="ghost" size="sm" icon="i-heroicons-arrow-path" class="w-full text-xs"
                    @click="forceGenerateQR">
                    {{ t('home.actions.refreshQR') }}
                  </UButton>
                </div>
              </div>

              <!-- Payment Details & Instructions -->
              <div class="space-y-6">
                <!-- Payment Details Card -->
                <div class="enhanced-card">
                  <div class="p-6 space-y-4">
                    <div class="text-center lg:text-left">
                      <div
                        class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3">
                        <UIcon name="i-heroicons-currency-dollar" class="h-6 w-6 text-white" />
                      </div>
                      <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {{ t('home.details.title') }}
                      </h4>
                    </div>

                    <div class="space-y-3 text-sm">
                      <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span class="text-gray-600 dark:text-gray-400">{{ t('home.details.order') }}</span>
                        <span class="font-semibold text-gray-900 dark:text-gray-100">#{{ studentData.student?.order
                        }}</span>
                      </div>

                      <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span class="text-gray-600 dark:text-gray-400">{{ t('home.details.name') }}</span>
                        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ studentData.student?.fullName
                        }}</span>
                      </div>

                      <div
                        class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-200/30 dark:border-green-700/30">
                        <span class="text-green-700 dark:text-green-300 font-medium">{{ t('home.details.amount')
                          }}</span>
                        <span class="font-bold text-green-700 dark:text-green-300 text-lg">{{ Number(settings?.paymentAmount || 276000).toLocaleString() }} VNĐ</span>
                      </div>

                      <!-- Destination Account Information -->
                      <div class="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200/30 dark:border-blue-700/30">
                        <div class="flex items-center space-x-2 mb-3">
                          <UIcon name="i-heroicons-banknotes" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h5 class="font-semibold text-blue-800 dark:text-blue-200">{{ t('home.details.destinationAccount') }}</h5>
                        </div>
                        
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between items-center">
                            <span class="text-blue-600 dark:text-blue-400">{{ t('home.details.bankName') }}</span>
                            <span class="font-medium text-blue-800 dark:text-blue-200">{{ settings?.bankName || 'HDBank' }}</span>
                          </div>
                          
                          <div class="flex justify-between items-center">
                            <span class="text-blue-600 dark:text-blue-400">{{ t('home.details.accountNumber') }}</span>
                            <span class="font-mono font-medium text-blue-800 dark:text-blue-200">{{ settings?.accountNumber || '099704070058389' }}</span>
                          </div>
                          
                          <div class="flex justify-between items-center">
                            <span class="text-blue-600 dark:text-blue-400">{{ t('home.details.accountHolder') }}</span>
                            <span class="font-medium text-blue-800 dark:text-blue-200">{{ settings?.accountHolder || 'Quy TTM63' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Instructions -->
                <div
                  class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <UIcon name="i-heroicons-information-circle" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h5 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        {{ t('home.instructions.title') }}
                      </h5>
                      <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>{{ t('home.instructions.step1') }}</li>
                        <li>{{ t('home.instructions.step2') }}</li>
                        <li>{{ t('home.instructions.step3') }}</li>
                        <li>{{ t('home.instructions.step4') }}</li>
                        <li>{{ t('home.instructions.step5') }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template #fallback>
            <div class="text-center py-12">
              <div class="animate-pulse space-y-4">
                <div class="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"/>
                <div class="space-y-2">
                  <div class="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"/>
                  <div class="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto"/>
                </div>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import anyAscii from 'any-ascii'
definePageMeta({
  // Using default layout
})
const { t } = useI18n()

const { user: currentUser } = useAuth()
const toast = useToast()

// Fetch student payment data only if studentId exists
const { data: studentData, pending, error } = useLazyFetch(() => {
  const userName = currentUser.value?.userName
  return userName ? `/api/students/${userName}` : null
}, {
  // Allow server-side fetching but handle missing currentUser gracefully
  default: () => ({ found: false, student: null }),
  // Handle errors gracefully without throwing
  onResponseError({ response }) {
    console.warn('Failed to fetch student data:', response.status, response.statusText)
  }
})

// Fetch settings
const { data: settings } = useFetch('/api/settings', {
  default: () => ({
    bankKey: 'hdbank',
    bankName: 'Ngân hàng TMCP Phát triển TP. Hồ Chí Minh',
    bankBin: '970436',
    accountNumber: '099704070058389',
    accountHolder: 'Phạm Trung Kiên',
    paymentAmount: '276000'
  })
})

// QR Code data
const qrCodeUrl = ref('')
const isGeneratingQR = ref(false)
const qrError = ref('')

const generateQRCode = async () => {
  if (!studentData.value?.student) {
    qrCodeUrl.value = ''
    return
  }

  // Don't generate QR code if student has already paid
  if (studentData.value.student.hasPaid) {
    qrCodeUrl.value = ''
    return
  }

  // Prevent multiple concurrent requests
  if (isGeneratingQR.value) {
    return
  }

  try {
    isGeneratingQR.value = true
    qrError.value = ''

    const student = studentData.value.student

    const fullName = anyAscii(student.fullName)

    // Create description string (order - studentId - fullName - accountHolder)
    const accountHolder = settings.value.accountHolder
    const description = $t('home.qr.description', { order: student.order, studentId: student.studentId, fullName: fullName, accountHolder: accountHolder })

    // Call QR generation API with settings from database
    const response = await $fetch('/api/qr/generate', {
      method: 'POST',
      body: {
        description: description,
        amount: settings.value.paymentAmount,
        bankNumber: settings.value.accountNumber
      }
    })

    if (response.success && response.data.qrCodeUrl) {
      qrCodeUrl.value = response.data.qrCodeUrl
      console.log('QR code generated successfully via API:', response.cached ? '(cached)' : '(new)')
    } else {
      throw new Error('Invalid API response')
    }

  } catch (error) {
    console.error('Error generating QR code via API:', error)
    qrError.value = error.message || 'Failed to generate QR code'
    qrCodeUrl.value = ''
  } finally {
    isGeneratingQR.value = false
  }
}

// Watch for changes in student data and regenerate QR code
watch(() => studentData.value?.student, (newStudent) => {
  if (newStudent && !newStudent.hasPaid) {
    generateQRCode()
  }
}, { immediate: true })

// Note: onMounted removed to prevent duplicate QR generation
// The watcher with immediate: true handles both initial load and subsequent changes

const onImageError = () => {
  toast.add({
    title: t('home.toasts.qrLoadErrorTitle'),
    description: t('home.toasts.qrLoadErrorDesc'),
    variant: 'destructive'
  })
}

const forceGenerateQR = async () => {
  // Don't allow force generation if student has already paid
  if (studentData.value?.student?.hasPaid) {
    toast.add({
      title: t('home.toasts.alreadyPaidTitle'),
      description: t('home.toasts.alreadyPaidDescNew'),
      color: 'orange'
    })
    return
  }

  try {
    // Clear current QR
    qrCodeUrl.value = ''
    qrError.value = ''

    // Regenerate
    await generateQRCode()

    if (qrCodeUrl.value) {
      toast.add({
        title: t('home.toasts.refreshSuccessTitle'),
        description: t('home.toasts.refreshSuccessDesc'),
        color: 'success'
      })
    } else {
      throw new Error('Failed to regenerate QR code')
    }
  } catch (error) {
    console.error('Error force generating QR:', error)
    toast.add({
      title: t('home.toasts.refreshErrorTitle'),
      description: t('home.toasts.refreshErrorDesc'),
      color: 'error'
    })
  }
}

const downloadQRCode = async () => {
  try {
    // Don't allow download if student has already paid
    if (studentData.value?.student?.hasPaid) {
      toast.add({
        title: t('home.toasts.alreadyPaidTitle'),
        description: t('home.toasts.alreadyPaidDescNoQR'),
        color: 'orange'
      })
      return
    }

    if (!qrCodeUrl.value) {
      toast.add({
        title: t('home.toasts.noQrTitle'),
        description: t('home.toasts.noQrDesc'),
        color: 'error'
      })
      return
    }

    // Convert base64 to blob and download
    const response = await fetch(qrCodeUrl.value)
    const blob = await response.blob()

    // Create download link with filename based on student order
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url

    // Generate filename from student data
    const student = studentData.value?.student
    const fileName = student ?
      `QR-TTM63-${student.order}-${student.studentId}.png` :
      'QR-TTM63-payment.png'

    link.download = fileName

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)

    toast.add({
      title: t('home.toasts.downloadSuccessTitle'),
      description: t('home.toasts.downloadSuccessDesc'),
      color: 'success'
    })
  } catch (error) {
    console.error('Error downloading QR code:', error)
    toast.add({
      title: t('home.toasts.downloadErrorTitle'),
      description: t('home.toasts.downloadErrorDesc'),
      color: 'error'
    })
  }
}
</script>

<style scoped>
.qr-container {
  /* Tỉ lệ 600x776 = 75:97 */
  aspect-ratio: 1;
  width: 280px;
  /* Mobile base width */
  max-width: 90vw;
  /* Responsive trên mobile */
  transition: all 0.3s ease-in-out;
}

.qr-container:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Tablet size */
@media (min-width: 640px) {
  .qr-container {
    width: 320px;
  }
}

/* Desktop size - Significantly larger for desktop layout */
@media (min-width: 1024px) {
  .qr-container {
    width: 420px;
    /* Much larger on desktop */
    max-width: none;
    /* Remove max-width constraint on desktop */
  }
}

/* Extra large desktop */
@media (min-width: 1280px) {
  .qr-container {
    width: 480px;
    /* Even larger on XL screens */
  }
}
</style>