<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="editingStudent ? t('studentModal.title.edit') : t('studentModal.title.add')"
    :description="editingStudent ? t('studentModal.description.edit') : t('studentModal.description.add')"
  >
    <template #body>
      <UForm ref="form" :schema="schema" :state="state" class="space-y-6" @submit="handleSubmit">
        <UFormField :label="t('studentModal.fields.order.label')" name="order" required>
          <UInputNumber
            v-model.number="state.order"
            :min="1"
            :max="999"
            :placeholder="t('studentModal.fields.order.placeholder')"
            class="text-center text-lg w-full"
          />
          <template #hint>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('studentModal.fields.order.hint') }}
            </div>
          </template>
        </UFormField>
        
        <UFormField :label="t('studentModal.fields.studentId.label')" name="studentId" required>
          <UInput 
            v-model="state.studentId" 
            :placeholder="t('studentModal.fields.studentId.placeholder')"
            class="text-center font-mono text-lg w-full" 
          />
        </UFormField>

        <UFormField :label="t('studentModal.fields.fullName.label')" name="fullName" required>
          <UInput 
            v-model="state.fullName" 
            :placeholder="t('studentModal.fields.fullName.placeholder')" 
            class="text-lg w-full" 
          />
        </UFormField>

        <UFormField :label="t('studentModal.fields.hasPaid.label')" name="hasPaid">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div class="flex items-center space-x-3">
              <div 
                :class="state.hasPaid ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'"
                class="w-10 h-10 rounded-full flex items-center justify-center"
              >
                <UIcon 
                  :name="state.hasPaid ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                  :class="state.hasPaid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  class="h-6 w-6" 
                />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ state.hasPaid ? t('studentModal.fields.hasPaid.paid') : t('studentModal.fields.hasPaid.unpaid') }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ state.hasPaid ? t('studentModal.fields.hasPaid.paidDesc') : t('studentModal.fields.hasPaid.unpaidDesc') }}
                </p>
              </div>
            </div>
            <USwitch v-model="state.hasPaid" size="lg" />
          </div>
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
        <UButton variant="ghost" type="button" class="w-full sm:w-auto" @click="handleCancel">
          {{ t('common.cancel') }}
        </UButton>
        <UButton 
          type="submit"
          :loading="submitting" 
          class="btn-primary w-full sm:w-auto"
          :icon="editingStudent ? 'i-heroicons-arrow-path' : 'i-heroicons-plus'"
          @click="onSubmit"
        >
          {{ editingStudent ? t('studentModal.footer.update') : t('studentModal.footer.add') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()
const model = defineModel()
const formRef = useTemplateRef('form')

interface Student {
  id?: string | number
  order: number
  studentId: string
  fullName: string
  hasPaid: boolean
}

const props = defineProps<{
  student?: Student | null
  order?: number
  onSubmit?: (data: any) => Promise<void> | void
}>()

const emit = defineEmits<{ 
  close: [boolean]
}>()

// Check if editing existing student
const editingStudent = computed(() => !!props.student)

// Form validation schema
const schema = z.object({
  order: z.number().min(1, t('studentModal.validation.orderMin')).max(999, t('studentModal.validation.orderMax')),
  studentId: z.string().min(1, t('studentModal.validation.studentIdRequired')).max(20, t('studentModal.validation.studentIdTooLong')),
  fullName: z.string().min(1, t('studentModal.validation.fullNameRequired')).max(100, t('studentModal.validation.fullNameTooLong')),
  hasPaid: z.boolean()
})

type Schema = z.output<typeof schema>

// Form state
const state = reactive<Partial<Schema>>({
  order: 1,
  studentId: '',
  fullName: '',
  hasPaid: false
})

const submitting = ref(false)

// Reset form to default values
const resetForm = () => {
  state.order = props.order || 1
  state.studentId = ''
  state.fullName = ''
  state.hasPaid = false
  formRef.value?.clear()
}

// Initialize form when student or nextOrder prop changes
watch(() => [props.student, props.order], ([student, nextOrder]) => {
  if (student && typeof student === 'object' && 'order' in student) {
    // Edit mode - populate form with student data
    state.order = student.order
    state.studentId = student.studentId
    state.fullName = student.fullName
    state.hasPaid = student.hasPaid
  } else {
    // Add mode - use next order number
    state.order = 1
    state.studentId = ''
    state.fullName = ''
    state.hasPaid = false
  }
}, { immediate: true })

const onSubmit = () => {
  formRef.value?.submit()
}

const handleSubmit = async (e: FormSubmitEvent<Schema>) => {
  try {
    submitting.value = true
    
    // Call the onSubmit handler passed as prop with validated form data
    await props.onSubmit?.({
      ...e.data,
      id: editingStudent.value ? props.student?.id : undefined
    })
    
    // Close modal on successful submission
    emit('close', false)
    
  } catch (error) {
    console.error('Form validation error:', error)
  } finally {
    submitting.value = false
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
