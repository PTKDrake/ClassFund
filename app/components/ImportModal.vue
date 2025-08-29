<template>
  <UModal :close="{ onClick: () => emit('close', false) }" :title="t('import.title')"
    :description="t('import.description')">
    <template #body>
      <div class="space-y-6">
        <!-- Import Mode Tabs -->
        <UTabs v-model="importTab" :items="importTabs" class="w-full">
          <template #file>
            <!-- File Upload Panel -->
            <div class="space-y-4">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('import.file.choose') }}
              </div>

              <div :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-600'
              ]" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
                <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileSelect">

                <div v-if="!selectedFile" class="space-y-4">
                  <div
                    class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-document-arrow-up" class="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p class="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {{ t('import.file.dragOr') }}
                      <button class="text-primary-600 hover:text-primary-700 underline" @click="fileInput?.click()">
                        {{ t('import.file.chooseFile') }}
                      </button>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t('import.file.support') }}
                    </p>
                  </div>
                </div>

                <div v-else class="space-y-3">
                  <div class="flex items-center justify-center space-x-2">
                    <UIcon name="i-heroicons-document-text" class="h-6 w-6 text-primary-600" />
                    <span class="font-medium text-gray-900 dark:text-gray-100">{{ selectedFile.name }}</span>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(selectedFile.size) }} • {{ getFileType(selectedFile.name) }}
                  </div>
                  <UButton size="sm" variant="ghost" icon="i-heroicons-x-mark" @click="clearFile">
                    {{ t('import.file.remove') }}
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Format Guide for File Import -->
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div class="text-sm">
                  <p class="font-medium text-blue-900 dark:text-blue-100 mb-2">{{ t('import.formatGuide.title') }}</p>
                  <div class="space-y-1 text-blue-700 dark:text-blue-300">
                    <p>{{ t('import.formatGuide.line1') }}</p>
                    <p>{{ t('import.formatGuide.line2') }}</p>
                    <p>{{ t('import.formatGuide.line3') }}</p>
                    <p>{{ t('import.formatGuide.line4') }}</p>
                  </div>
                </div>
              </div>
            </div>

          </template>

          <template #clipboard>
            <!-- Clipboard Import Panel -->
            <div class="space-y-4">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('import.clipboard.title') }}
              </div>

              <div class="space-y-4">
                <!-- Paste Area -->
                <div class="relative">
                  <UTextarea v-model="clipboardData" :rows="10" :placeholder="t('import.clipboard.placeholder')"
                    class="w-full font-mono text-sm" @input="processClipboardData" @change="processClipboardData"
                    @paste="processClipboardData" />
                  <div class="absolute top-2 right-2">
                    <UButton size="xs" variant="ghost" icon="i-heroicons-clipboard-document"
                      @click="pasteFromClipboard">
                      Paste
                    </UButton>
                  </div>
                </div>

                <!-- Header Detection Toggle -->
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <UIcon name="i-heroicons-bars-3-bottom-left" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ t('import.headerToggle.title')
                        }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('import.headerToggle.subtitle') }}</p>
                    </div>
                  </div>
                  <USwitch v-model="hasClipboardHeader" />
                </div>
              </div>

              <!-- Format Guide for Clipboard -->
              <div
                class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <UIcon name="i-heroicons-information-circle"
                    class="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div class="text-sm">
                    <p class="font-medium text-green-900 dark:text-green-100 mb-2">{{ t('import.clipboardGuide.title')
                      }}</p>
                    <div class="space-y-1 text-green-700 dark:text-green-300">
                      <p>{{ t('import.clipboardGuide.line1') }}</p>
                      <p>{{ t('import.clipboardGuide.line2') }}</p>
                      <p>{{ t('import.clipboardGuide.line3') }}</p>
                      <p>{{ t('import.clipboardGuide.line4') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </UTabs>

        <!-- Preview Data Section - Common for both tabs -->
        <div v-if="previewData && previewData.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('import.preview.title', { count: previewData.length }) }}
            </div>
            <UBadge v-if="validationErrors.length > 0" color="error" variant="solid">
              {{ t('import.preview.errorsBadge', { count: validationErrors.length }) }}
            </UBadge>
          </div>

          <div class="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{
                    t('import.preview.table.order') }}</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{
                    t('import.preview.table.studentId') }}</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{
                    t('import.preview.table.fullName') }}</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{
                    t('import.preview.table.status') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(item, index) in previewData" :key="index"
                  :class="item.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-900'">
                  <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{{ item.order }}</td>
                  <td class="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100">{{ item.studentId }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{{ item.fullName }}</td>
                  <td class="px-4 py-2 text-sm">
                    <div v-if="item.errors.length > 0" class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-red-500" />
                      <span class="text-red-600 dark:text-red-400">{{ item.errors[0] }}</span>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-green-500" />
                      <span class="text-green-600 dark:text-green-400">{{ t('import.preview.valid') }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Validation Errors Summary -->
          <div v-if="validationErrors.length > 0"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div class="text-sm">
                <p class="font-medium text-red-900 dark:text-red-100 mb-2">{{ t('import.preview.summaryTitle', {
                  count:
                  validationErrors.length }) }}</p>
                <ul class="space-y-1 text-red-700 dark:text-red-300">
                  <li v-for="error in validationErrors.slice(0, 5)" :key="error" class="list-disc list-inside">
                    {{ error }}
                  </li>
                  <li v-if="validationErrors.length > 5" class="text-red-600 dark:text-red-400">
                    {{ t('import.preview.summaryRest', { rest: validationErrors.length - 5 }) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Import Options -->
        <div v-if="previewData && previewData.length > 0" class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('import.options.title') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('import.options.subtitle') }}</p>
            </div>
            <USelectMenu v-model="importMode" :items="importModeOptions" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
        <UButton variant="ghost" type="button" class="w-full sm:w-auto" @click="handleCancel">
          {{ t('common.cancel') }}
        </UButton>
        <UButton :loading="importing" :disabled="!canImport" class="btn-primary w-full sm:w-auto"
          icon="i-heroicons-arrow-down-tray" @click="handleImport">
          {{ t('import.footer.import', { count: previewData?.length || 0 }) }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { SelectMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const emit = defineEmits<{
  close: [boolean]
}>()

const props = defineProps<{
  onImport?: (data: any[]) => Promise<void> | void
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const importing = ref(false)
const previewData = ref<any[]>([])

// Clipboard import refs
const clipboardData = ref('')
const hasClipboardHeader = ref(true)
const importTab = ref('file')

// Import mode options
const importModeOptions = ref([
  { label: t('import.options.modes.skip'), value: 'skip_existing' },
  { label: t('import.options.modes.update'), value: 'update_existing' },
  { label: t('import.options.modes.replace'), value: 'replace_all' }
] satisfies SelectMenuItem[])

const importMode = ref(importModeOptions.value[0])

// Import tabs configuration
const importTabs = [
  {
    value: 'file',
    label: 'Upload File',
    icon: 'i-heroicons-document-arrow-up',
    slot: 'file' as const
  },
  {
    value: 'clipboard',
    label: 'Paste Clipboard',
    icon: 'i-heroicons-clipboard-document',
    slot: 'clipboard' as const
  }
]

// Computed
const validationErrors = computed(() => {
  if (!previewData.value) return []

  const errors: string[] = []
  previewData.value.forEach((item, index) => {
    item.errors.forEach((error: string) => {
      errors.push(`Dòng ${index + 2}: ${error}`)
    })
  })

  return errors
})

// Computed for import button state
const canImport = computed(() => {
  const hasData = importTab.value === 'file' ? !!selectedFile.value : !!clipboardData.value.trim()
  const hasPreviewData = previewData.value && previewData.value.length > 0
  const hasNoErrors = validationErrors.value.length === 0

  return hasData && hasPreviewData && hasNoErrors
})

// File handling
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Clipboard handling
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    clipboardData.value = text
    processClipboardData()
  } catch (error) {
    console.error('Failed to read clipboard:', error)
    // Fallback: user can paste manually
  }
}

const processClipboardData = () => {
  if (!clipboardData.value.trim()) {
    previewData.value = []
    return
  }

  try {
    // Split by newlines and filter out empty lines
    const lines = clipboardData.value
      .split(/\r?\n/)
      .filter(line => line.trim())

    if (lines.length === 0) {
      previewData.value = []
      return
    }

    // Skip header if enabled
    const dataLines = hasClipboardHeader.value ? lines.slice(1) : lines

    const processedData = dataLines.map((line, index) => {
      // Split by tabs (or multiple whitespaces as fallback)
      const columns = line.split(/\t+/).map(col => col.trim())

      // If no tabs found, try splitting by multiple spaces
      if (columns.length === 1) {
        const spaceColumns = line.split(/\s{2,}/).map(col => col.trim())
        if (spaceColumns.length >= 3) {
          columns.splice(0, 1, ...spaceColumns)
        }
      }

      const order = parseInt(columns[0] || '') || (index + 1)
      const studentId = (columns[1] || '').toString().trim()
      const fullName = (columns[2] || '').toString().trim()

      // Validation
      const errors: string[] = []
      if (!studentId) errors.push(t('import.validation.studentIdRequired'))
      if (!fullName) errors.push(t('import.validation.fullNameRequired'))
      if (isNaN(order) || order <= 0) errors.push(t('import.validation.orderPositive'))
      if (studentId && studentId.length > 20) errors.push(t('import.validation.studentIdTooLong'))
      if (fullName && fullName.length > 100) errors.push(t('import.validation.fullNameTooLong'))
      if (columns.length < 3) errors.push(t('import.validation.missingColumns'))

      return {
        order,
        studentId,
        fullName,
        errors
      }
    }).filter(item => item.studentId || item.fullName) // Filter out completely empty rows

    previewData.value = processedData
  } catch (error) {
    console.error('Error processing clipboard data:', error)
    previewData.value = []
  }
}

const processFile = async (file: File) => {
  if (!isValidFile(file)) {
    return
  }

  selectedFile.value = file

  try {
    if (file.name.toLowerCase().endsWith('.csv')) {
      await parseCSV(file)
    } else {
      await parseExcel(file)
    }
  } catch (error) {
    console.error('Error processing file:', error)
    // Show error toast
  }
}

const parseCSV = (file: File): Promise<void> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        processData(results.data)
        resolve()
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        resolve()
      }
    })
  })
}

const parseExcel = (file: File): Promise<void> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) throw new Error('No sheets found in Excel file')
        const firstSheet = workbook.Sheets[firstSheetName]
        if (!firstSheet) throw new Error('Sheet not found in Excel file')
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

        // Convert to objects with headers
        if (jsonData.length > 1) {
          const headers = jsonData[0] as string[]
          const rows = jsonData.slice(1) as any[][]

          const objects = rows.map(row => {
            const obj: any = {}
            headers.forEach((header, index) => {
              if (header && typeof header === 'string') {
                obj[header] = (row && row[index]) || ''
              }
            })
            return obj
          }).filter(obj => Object.values(obj).some(val => val && val.toString().trim()))

          processData(objects)
        }
        resolve()
      } catch (error) {
        console.error('Excel parsing error:', error)
        resolve()
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

const processData = (data: any[]) => {
  const processedData = data.map((row, index) => {
    // Normalize headers - handle both uppercase and lowercase, with/without spaces
    const normalizeKey = (key: string) => key.toString().toLowerCase().replace(/\s+/g, '')

    // Find the correct keys for STT, MSV, HOTEN
    const keys = Object.keys(row)
    const orderKey = keys.find(k => ['stt', 'so', 'thu', 'tu'].some(term => normalizeKey(k).includes(term))) || keys[0]
    const studentIdKey = keys.find(k => ['msv', 'ma', 'so', 'sv', 'masinhvien'].some(term => normalizeKey(k).includes(term))) || keys[1]
    const nameKey = keys.find(k => ['hoten', 'ten', 'ho', 'name', 'fullname'].some(term => normalizeKey(k).includes(term))) || keys[2]

    const safeOrderKey = orderKey || keys[0] || ''
    const safeStudentIdKey = studentIdKey || keys[1] || ''
    const safeNameKey = nameKey || keys[2] || ''

    const order = parseInt((safeOrderKey && row[safeOrderKey]) || '') || (index + 1)
    const studentId = ((safeStudentIdKey && row[safeStudentIdKey]) || '').toString().trim()
    const fullName = ((safeNameKey && row[safeNameKey]) || '').toString().trim()

    // Validation
    const errors: string[] = []
    if (!studentId) errors.push(t('import.validation.studentIdRequired'))
    if (!fullName) errors.push(t('import.validation.fullNameRequired'))
    if (isNaN(order) || order <= 0) errors.push(t('import.validation.orderPositive'))
    if (studentId && studentId.length > 20) errors.push(t('import.validation.studentIdTooLong'))
    if (fullName && fullName.length > 100) errors.push(t('import.validation.fullNameTooLong'))

    return {
      order,
      studentId,
      fullName,
      errors
    }
  }).filter(item => item.studentId || item.fullName) // Filter out completely empty rows

  previewData.value = processedData
}

const isValidFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['.xlsx', '.xls', '.csv']

  if (file.size > maxSize) {
    // Show error toast
    return false
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedTypes.includes(extension)) {
    // Show error toast
    return false
  }

  return true
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toUpperCase()
  return extension === 'XLSX' ? 'Excel' : extension === 'XLS' ? 'Excel Legacy' : 'CSV'
}

// Actions
// Watch for clipboard header changes
watch(hasClipboardHeader, () => {
  if (clipboardData.value.trim()) {
    processClipboardData()
  }
})

// Watch for clipboard data changes 
watch(clipboardData, (newData) => {
  if (newData.trim()) {
    processClipboardData()
  } else {
    previewData.value = []
  }
})

// Watch for tab changes to clear data
watch(importTab, (newTab, oldTab) => {
  if (newTab !== oldTab) {
    previewData.value = []
    if (newTab === 'clipboard') {
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    } else {
      clipboardData.value = ''
    }
  }
})

const handleImport = async () => {
  if (!previewData.value || previewData.value.length === 0 || validationErrors.value.length > 0) {
    return
  }

  try {
    importing.value = true

    // Filter out items with errors
    const validData = previewData.value.filter(item => item.errors.length === 0)

    await props.onImport?.(validData.map(item => ({
      order: item.order,
      studentId: item.studentId,
      fullName: item.fullName,
      importMode: importMode.value
    })))

    emit('close', false)
  } catch (error) {
    console.error('Import error:', error)
  } finally {
    importing.value = false
  }
}

const handleCancel = () => {
  emit('close', false)
}
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  transform: scale(1);
}

.btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #6b21a8);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}
</style>
