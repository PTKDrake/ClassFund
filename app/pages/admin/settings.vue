<template>
  <div class="space-y-8">
    <!-- Enhanced Header Section -->
    <div class="enhanced-card p-6">
      <div class="flex items-center space-x-4">
        <div class="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
          <UIcon name="i-heroicons-cog-6-tooth" class="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            {{ t('settings.title') }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ t('settings.subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Bank Account Settings -->
    <div class="enhanced-card">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <UIcon name="i-heroicons-banknotes" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              {{ t('settings.bankAccount.title') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('settings.bankAccount.subtitle') }}
            </p>
          </div>
        </div>

        <form @submit.prevent="saveSettings" class="space-y-6">
          <!-- Bank Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.bankName') }}
            </label>
            <USelectMenu
              v-model="selectedBank"
              :items="bankOptions"
              :placeholder="t('settings.bankAccount.selectBank')"
              class="w-full"
              searchable
              value-key="value"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.bankNameHint') }}
            </p>
          </div>

          <!-- Account Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.accountNumber') }}
            </label>
            <UInput
              v-model="accountNumber"
              :placeholder="t('settings.bankAccount.accountNumberPlaceholder')"
              class="w-full font-mono"
              maxlength="20"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.accountNumberHint') }}
            </p>
          </div>

          <!-- Account Holder Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.accountHolder') }}
            </label>
            <UInput
              v-model="accountHolder"
              :placeholder="t('settings.bankAccount.accountHolderPlaceholder')"
              class="w-full"
              maxlength="100"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.accountHolderHint') }}
            </p>
          </div>

          <!-- Payment Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.paymentAmount') }}
            </label>
            <UInput
              v-model="paymentAmount"
              :placeholder="t('settings.bankAccount.paymentAmountPlaceholder')"
              class="w-full"
              type="number"
              min="0"
              step="1000"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.paymentAmountHint') }}
            </p>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end space-x-3 pt-4">
            <UButton
              type="button"
              variant="ghost"
              @click="resetForm"
              :disabled="isLoading"
            >
              {{ t('settings.actions.reset') }}
            </UButton>
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="!isFormValid"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {{ t('settings.actions.save') }}
            </UButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Current Settings Preview -->
    <div v-if="currentSettings" class="enhanced-card">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <UIcon name="i-heroicons-eye" class="h-6 w-6 text-white" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t('settings.preview.title') }}
          </h3>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl p-4">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.bankName') }}</span>
              <span class="font-semibold text-blue-800 dark:text-blue-200">{{ currentSettings.bankName }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.accountNumber') }}</span>
              <span class="font-mono font-semibold text-blue-800 dark:text-blue-200">{{ currentSettings.accountNumber }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.accountHolder') }}</span>
              <span class="font-semibold text-blue-800 dark:text-blue-200">{{ currentSettings.accountHolder }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.paymentAmount') }}</span>
              <span class="font-bold text-blue-800 dark:text-blue-200 text-lg">{{ formatCurrency(currentSettings.paymentAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Using default layout
})

const { t } = useI18n()
const toast = useToast()

// Form data
const selectedBank = ref('hdbank')
const accountNumber = ref('')
const accountHolder = ref('')
const paymentAmount = ref('276000')
const isLoading = ref(false)

// Current settings for preview
const currentSettings = ref<any>(null)

// Bank options from vietnam-qr-pay
const bankOptions = ref<Array<{ label: string; value: string; bank: any }>>([])

// Form validation
const isFormValid = computed(() => {
  return selectedBank.value && 
         accountNumber.value.trim() && 
         accountHolder.value.trim() && 
         paymentAmount.value && 
         parseInt(paymentAmount.value) > 0
})

// Load bank options
const loadBankOptions = async () => {
  try {
    // Import BanksObject from vietnam-qr-pay
    const { BanksObject } = await import('vietnam-qr-pay')
    
    bankOptions.value = Object.entries(BanksObject).map(([key, bank]) => ({
      label: bank.shortName + ' - ' + bank.name,
      value: key,
      bank: bank
    })).sort((a, b) => a.label.localeCompare(b.label))
    
    console.log(`Loaded ${bankOptions.value.length} banks`)
  } catch (error) {
    console.error('Error loading banks:', error)
    toast.add({
      title: t('settings.errors.loadBanksTitle'),
      description: t('settings.errors.loadBanksDesc'),
      color: 'error'
    })
  }
}

// Load current settings
const loadCurrentSettings = async () => {
  try {
    const {data: response} = await $fetch('/api/settings') as any
      currentSettings.value = response.data
      // Populate form with current settings
      selectedBank.value = response.data.bankKey || ''
      accountNumber.value = response.data.accountNumber || ''
      accountHolder.value = response.data.accountHolder || ''
      paymentAmount.value = response.data.paymentAmount || '276000'
  } catch (error) {
    console.error('Error loading settings:', error)
    // Set default values if no settings exist
    selectedBank.value = 'hdbank'
    accountNumber.value = '099704070058389'
    accountHolder.value = 'Quy TTM63'
    paymentAmount.value = '276000'
  }
}

// Save settings
const saveSettings = async () => {
  if (!isFormValid.value) {
    toast.add({
      title: t('settings.errors.invalidFormTitle'),
      description: t('settings.errors.invalidFormDesc'),
      color: 'error'
    })
    return
  }

  isLoading.value = true
  
  try {
    const selectedBankData = bankOptions.value.find(bank => bank.value === selectedBank.value)
    
    const settingsData = {
      bankKey: selectedBank.value,
      bankName: selectedBankData?.label || '',
      bankBin: selectedBankData?.bank?.bin || '',
      accountNumber: accountNumber.value.trim(),
      accountHolder: accountHolder.value.trim(),
      paymentAmount: paymentAmount.value
    }

    const response = await $fetch('/api/admin/settings', {
      method: 'POST',
      body: settingsData
    }) as any

    if (response.success) {
      toast.add({
        title: t('settings.success.title'),
        description: t('settings.success.desc'),
        color: 'success'
      })
      
      // Update current settings
      currentSettings.value = settingsData
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    toast.add({
      title: t('settings.errors.saveTitle'),
      description: t('settings.errors.saveDesc'),
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  loadCurrentSettings()
}

// Format currency
const formatCurrency = (amount: string) => {
  const num = parseInt(amount)
  return num.toLocaleString('vi-VN') + ' VNĐ'
}

// Initialize
onMounted(async () => {
  await loadBankOptions()
  await loadCurrentSettings()
})
</script>

<style>

</style>