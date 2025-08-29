<template>
  <div class="space-y-8">
    <!-- Enhanced Header Section -->
    <div class="enhanced-card p-6">
      <div class="flex items-center space-x-4">
        <div class="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
          <UIcon name="i-heroicons-cog-6-tooth" class="h-8 w-8 text-white" />
        </div>
        <div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
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

        <form class="space-y-6" @submit.prevent="saveSettings">
          <!-- Bank Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.bankName') }}
            </label>
            <USelectMenu
v-model="currentSettings.bankKey" :items="bankOptions" :placeholder="t('settings.bankAccount.selectBank')"
              class="w-full" searchable value-key="value" />
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
v-model="currentSettings.accountNumber" :placeholder="t('settings.bankAccount.accountNumberPlaceholder')"
              class="w-full font-mono" maxlength="20" />
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
v-model="currentSettings.accountHolder" :placeholder="t('settings.bankAccount.accountHolderPlaceholder')"
              class="w-full" maxlength="100" />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.accountHolderHint') }}
            </p>
          </div>

          <!-- Payment Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('settings.bankAccount.paymentAmount') }}
            </label>
            <UInputNumber
v-model="currentSettings.paymentAmount" :format-options="{
              style: 'currency',
              currency: 'VND',
              currencyDisplay: 'symbol',
              currencySign: 'accounting'
            }" locale="vi-VN" :placeholder="t('settings.bankAccount.paymentAmountPlaceholder')"
              class="w-full" :min="1000" :step="1000"/>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('settings.bankAccount.paymentAmountHint') }}
            </p>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end space-x-3 pt-4">
            <UButton type="button" variant="ghost" :disabled="isLoading" @click="resetForm">
              {{ t('settings.actions.reset') }}
            </UButton>
            <UButton
type="submit" :loading="isLoading" :disabled="!isFormValid"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
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

        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl p-4">
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.bankName') }}</span>
              <span class="font-semibold text-blue-800 dark:text-blue-200">{{ bankOptions.find(bank => bank.value === currentSettings.bankKey)?.label }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.accountNumber')
                }}</span>
              <span class="font-mono font-semibold text-blue-800 dark:text-blue-200">{{ currentSettings.accountNumber
                }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.accountHolder')
                }}</span>
              <span class="font-semibold text-blue-800 dark:text-blue-200">{{ currentSettings.accountHolder }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 dark:text-blue-400 font-medium">{{ t('settings.preview.paymentAmount')
                }}</span>
              <span class="font-bold text-blue-800 dark:text-blue-200 text-lg">{{
                formatCurrency(currentSettings.paymentAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaymentAddress } from '~~/shared/utils/types'

const { t } = useI18n()
const toast = useToast()

// Form data
const isLoading = ref(false)

// Current settings for preview
const currentSettings = ref<PaymentAddress>({
  bankKey: 'hdbank',
  accountNumber: '099704070058389',
  accountHolder: 'Phạm Trung Kiên',
  paymentAmount: 276000
})

// Bank options from vietnam-qr-pay
const bankOptions = ref<Array<{ label: string; value: string; bank: any }>>([])

// Form validation
const isFormValid = computed(() => {
  return currentSettings.value.bankKey &&
    currentSettings.value.accountNumber.trim() &&
    currentSettings.value.accountHolder.trim() &&
    currentSettings.value.paymentAmount &&
    currentSettings.value.paymentAmount > 0
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
    const { data } = await $fetch('/api/settings') as any
    if(!data) return
    data.paymentAmount = parseInt(data.paymentAmount)
    currentSettings.value = data
  } catch (error) {
    console.error('Error loading settings:', error)
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
    const selectedBankData = bankOptions.value.find(bank => bank.value === currentSettings.value.bankKey)

    const settingsData = {
      bankKey: currentSettings.value.bankKey,
      bankName: selectedBankData?.label || '',
      bankBin: selectedBankData?.bank?.bin || '',
      accountNumber: currentSettings.value.accountNumber.trim(),
      accountHolder: currentSettings.value.accountHolder.trim(),
      paymentAmount: currentSettings.value.paymentAmount.toString()
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
const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: 'symbol',
    currencySign: 'accounting'
  }).format(num)
}

// Initialize
onMounted(async () => {
  await loadBankOptions()
  await loadCurrentSettings()
})
</script>

<style></style>