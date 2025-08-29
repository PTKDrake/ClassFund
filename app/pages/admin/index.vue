<template>
  <div class="space-y-8">
    <!-- Enhanced Header Section -->
    <div class="enhanced-card p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg">
            <UIcon name="i-heroicons-users" class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-700 to-teal-700 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
              {{ t('admin.header.title') }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ t('admin.header.subtitle') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton @click="openImportModal" class="btn-secondary" icon="i-heroicons-arrow-down-tray"
            :label="t('admin.buttons.import')" size="lg" />
          <UButton @click="openAddStudentModal" class="btn-primary" icon="i-heroicons-plus" :label="t('admin.buttons.addStudent')"
            size="lg" />
        </div>
      </div>



      <!-- Stats Overview -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <UIcon name="i-heroicons-users" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ t('admin.stats.total') }}</p>
              <p class="text-xl font-bold text-blue-700 dark:text-blue-300">{{ stats?.totalCount || 0 }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200/30 dark:border-green-700/30 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
              <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm text-green-600 dark:text-green-400 font-medium">{{ t('admin.stats.paid') }}</p>
              <p class="text-xl font-bold text-green-700 dark:text-green-300">{{ paidCount }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200/30 dark:border-red-700/30 rounded-xl p-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg">
              <UIcon name="i-heroicons-x-circle" class="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">{{ t('admin.stats.unpaid') }}</p>
              <p class="text-xl font-bold text-red-700 dark:text-red-300">{{ unpaidCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Students Table -->
    <div class="enhanced-card">
      <!-- Table Header with Search & Filters -->
      <div class="p-6 border-b border-gray-200/30 dark:border-gray-700/30">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <UIcon name="i-heroicons-table-cells" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>{{ t('admin.table.headerTitle') }}</span>
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ t('admin.table.headerSubtitle') }}
            </p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" :placeholder="t('admin.search.placeholder')"
              class="w-full sm:w-64" />
            <USelectMenu v-model="selectedStatus" value-key="id" :items="statusItems" :placeholder="t('admin.search.filterPlaceholder')"
              class="w-full sm:w-auto" />
          </div>
        </div>

        <!-- Bulk Actions (will be implemented with proper selection) -->
        <div v-if="false && selectedStudents.length > 0"
          class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
              {{ selectedStudents.length }} sinh viên được chọn
            </span>
            <UButton @click="clearSelection" variant="ghost" size="xs" class="text-blue-600 hover:text-blue-700">
              Bỏ chọn
            </UButton>
          </div>
          <div class="flex items-center space-x-2">
            <UButton @click="bulkMarkPaid" size="sm" color="success" variant="outline">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              Đánh dấu đã đóng
            </UButton>
            <UButton @click="bulkMarkUnpaid" size="sm" color="warning" variant="outline">
              <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
              Đánh dấu chưa đóng
            </UButton>
            <UButton @click="bulkDelete" size="sm" color="error" variant="outline">
              <UIcon name="i-heroicons-trash" class="h-4 w-4" />
              Xóa
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="status !== 'success' && !error" class="p-12 text-center">
        <div class="enhanced-spinner mx-auto mb-6"></div>
        <div class="space-y-2">
          <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.loading.title') }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.loading.subtitle') }}</p>
        </div>
      </div>

      <div v-else-if="error" class="p-12 text-center">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-10 w-10 text-red-500" />
        </div>
        <h3 class="text-xl font-bold text-red-700 dark:text-red-400 mb-2">{{ t('admin.error.title') }}</h3>
        <p class="text-red-600 dark:text-red-300">{{ t('admin.error.subtitle') }}</p>
      </div>

      <div v-else-if="!data?.students || (data as any).students.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-user-plus" class="h-10 w-10 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.empty.title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('admin.empty.subtitle') }}</p>
        <UButton @click="openAddStudentModal" class="btn-primary" icon="i-heroicons-plus">
          {{ t('admin.buttons.addFirst') }}
        </UButton>
      </div>

      <div v-else>
        <!-- UTable with enhanced features -->
        <UTable v-model:sorting="sorting" :columns="tableColumns as any" :data="data?.students" :pagination="pagination"
          :loading="status !== 'success'" :error="error" class="w-full">
        </UTable>

        <!-- Simple Pagination (align with test2.vue) -->
        <div class="flex justify-center border-t py-4">
          <UPagination v-if="data?.total && data?.total > pagination.pageSize" :total="(data as any)?.total"
            :items-per-page="pagination.pageSize" :default-page="pagination.pageIndex + 1"
            @update:page="(p) => (pagination.pageIndex = p - 1)" show-edges color="primary" />
        </div>
      </div>
    </div>

    <!-- Add/Edit Student Modal -->

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // Using default layout
})
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import StudentModal from '~/components/StudentModal.vue'
import ImportModal from '~/components/ImportModal.vue'
import { h, ref, computed } from 'vue'
import { UTable, UPagination, UInput, USelect, UButton, UBadge } from '#components'
import type { Student, StatsResponse } from '~/types'

const toast = useToast()
const overlay = useOverlay()

// Pagination and search state (align with test2.vue)
const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedStudents = ref<Student[]>([])

// Status filter options
const { t } = useI18n()
const statusItems = ref([
  { id: 'all', label: t('admin.search.all') },
  { id: 'paid', label: t('admin.search.paid') },
  { id: 'unpaid', label: t('admin.search.unpaid') }
])

// Sorting state for table (client-side sorting as in test2.vue)
const sorting = ref([
  {
    id: 'order',
    desc: false,
  }
])

// Query params and fetch (pattern from test2.vue)
const queryParams = computed(() => ({
  page: pagination.value.pageIndex + 1,
  pageSize: pagination.value.pageSize,
  search: searchQuery.value,
  hasPaid: selectedStatus.value,
  sort: sorting.value[0]?.id,
  dir: sorting.value[0]?.desc ? 'desc' : 'asc'
}))

const { data, error, status, refresh } = useFetch('/api/students', {
  query: queryParams,
})

// Fetch statistics separately
const { data: stats, refresh: refreshStats } = await useFetch<StatsResponse>('/api/students/stats')

// Statistics computed properties
const paidCount = computed(() => stats.value?.paidCount || 0)
const unpaidCount = computed(() => stats.value?.unpaidCount || 0)

// UTable columns configuration
const tableColumns: TableColumn<Student>[] = [
  {
    accessorKey: 'order',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        label: t('admin.table.columns.order'),
        icon: isSorted ? isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-down',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'studentId',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        label: t('admin.table.columns.studentId'),
        icon: isSorted ? isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-down',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        label: t('admin.table.columns.fullName'),
        icon: isSorted ? isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-down',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'hasPaid',
    header: t('admin.table.columns.status'),
    cell: ({ row }) => {
      return h(UBadge, {
        color: (row as unknown as Student).hasPaid ? 'success' : 'error',
        variant: 'subtle',
      }, () => row.getValue('hasPaid') ? t('admin.table.columns.paid') : t('admin.table.columns.unpaid'))
    }
  },
  {
    accessorKey: 'actions',
    header: t('admin.table.columns.actions'),
    cell: ({ row }) => {
      return [h(UButton, {
        icon: 'i-lucide-pen',
        variant: 'ghost',
        color: 'secondary',
        onClick: () => editStudent(row.original)
      }), h(UButton, {
        icon: 'i-lucide-trash',
        variant: 'ghost',
        color: 'warning',
        onClick: () => deleteStudent(row.original)
      })]
    }
  }
]

// Debounced search
const debouncedSearch = () => {
  pagination.value.pageIndex = 0
}

// Table event handlers
const onRowSelect = (row: any) => {
  console.log('Selected row:', row)
}

// Bulk actions
const clearSelection = () => {
  selectedStudents.value = []
}

const bulkMarkPaid = async () => {
  if (!confirm(t('admin.confirm.markPaid', { count: selectedStudents.value.length }))) {
    return
  }

  try {
    const promises = selectedStudents.value.map(student =>
      $fetch(`/api/admin/students/${student.studentId}`, {
        method: 'PUT',
        body: { ...student, hasPaid: true }
      })
    )

    await Promise.all(promises)

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.markedPaidMany', { count: selectedStudents.value.length })
    })

    selectedStudents.value = []
    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Bulk mark paid error:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotUpdateStatus'),
      color: 'error'
    })
  }
}

const bulkMarkUnpaid = async () => {
  if (!confirm(t('admin.confirm.markUnpaid', { count: selectedStudents.value.length }))) {
    return
  }

  try {
    const promises = selectedStudents.value.map(student =>
      $fetch(`/api/admin/students/${student.studentId}`, {
        method: 'PUT',
        body: { ...student, hasPaid: false }
      })
    )

    await Promise.all(promises)

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.markedUnpaidMany', { count: selectedStudents.value.length })
    })

    selectedStudents.value = []
    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Bulk mark unpaid error:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotUpdateStatus'),
      color: 'error'
    })
  }
}

const bulkDelete = async () => {
  if (!confirm(t('admin.confirm.deleteMany', { count: selectedStudents.value.length }))) {
    return
  }

  try {
    const promises = selectedStudents.value.map(student =>
      $fetch(`/api/admin/students/${student.studentId}`, {
        method: 'DELETE'
      })
    )

    await Promise.all(promises)

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.deletedMany', { count: selectedStudents.value.length })
    })

    selectedStudents.value = []
    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Bulk delete error:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotDelete'),
      color: 'error'
    })
  }
}

// Row actions dropdown - Updated for UDropdownMenu according to https://ui.nuxt.com/components/dropdown-menu
const getRowActions = (row: Student): DropdownMenuItem[][] => [
  [{
    label: t('admin.dropdown.editInfo'),
    icon: 'i-heroicons-pencil-square',
    onSelect: () => editStudent(row),
    kbds: ['e']
  }],
  [{
    label: row.hasPaid ? t('admin.dropdown.markUnpaid') : t('admin.dropdown.markPaid'),
    icon: row.hasPaid ? 'i-heroicons-x-circle' : 'i-heroicons-check-circle',
    onSelect: () => togglePaymentStatus(row),
    color: row.hasPaid ? 'warning' as const : 'success' as const
  }],
  [{
    label: t('admin.dropdown.delete'),
    icon: 'i-heroicons-trash',
    onSelect: () => deleteStudent(row),
    color: 'error' as const,
    kbds: ['shift', 'delete']
  }]
]

// Toggle payment status
const togglePaymentStatus = async (student: Student) => {
  try {
    await $fetch(`/api/admin/students/${student.studentId}`, {
      method: 'PUT',
      body: {
        order: student.order,
        studentId: student.studentId,
        fullName: student.fullName,
        hasPaid: !student.hasPaid
      }
    })

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.statusUpdated', { status: !student.hasPaid ? t('admin.dropdown.markPaid') : t('admin.dropdown.markUnpaid'), name: student.fullName })
    })

    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Toggle payment status error:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotUpdateStatus'),
      color: 'error'
    })
  }
}

// Create modals instances
const studentModal = overlay.create(StudentModal)
const importModal = overlay.create(ImportModal)

// Handle student form submission
const handleStudentSubmit = async (data: any) => {
  try {
    if (data.id) {
      // Update existing student
      await $fetch(`/api/admin/students/${data.studentId}`, {
        method: 'PUT',
        body: {
          order: data.order,
          studentId: data.studentId,
          fullName: data.fullName,
          hasPaid: data.hasPaid
        }
      })
      toast.add({
        title: t('common.success'),
        description: t('admin.toasts.updated')
      })
    } else {
      // Create new student
      await $fetch('/api/admin/students', {
        method: 'POST',
        body: {
          order: data.order,
          studentId: data.studentId,
          fullName: data.fullName,
          hasPaid: data.hasPaid
        }
      })
      toast.add({
        title: t('common.success'),
        description: t('admin.toasts.created')
      })
    }

    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotSave'),
      color: 'error'
    })
    throw error // Re-throw to prevent modal from closing
  }
}

// Open modal for adding new student
const openAddStudentModal = () => {
  studentModal.open({
    student: undefined,
    order: 1,
    onSubmit: handleStudentSubmit
  })
}

const editStudent = (student: Student) => {
  studentModal.open({
    student: {
      id: student.studentId, // Use studentId as ID for API calls
      order: student.order,
      studentId: student.studentId,
      fullName: student.fullName,
      hasPaid: student.hasPaid
    },
    onSubmit: handleStudentSubmit
  })
}

const deleteStudent = async (student: Student) => {
  if (!confirm(t('admin.confirm.deleteOne'))) {
    return
  }

  try {
    await $fetch(`/api/admin/students/${student.studentId}`, {
      method: 'DELETE'
    })

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.deletedOne')
    })

    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Error deleting student:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotDelete'),
      color: 'error'
    })
  }
}

// Handle import submission
const handleImportSubmit = async (data: any[]) => {
  try {
    await $fetch('/api/admin/students/import', {
      method: 'POST',
      body: {
        students: data,
        importMode: data[0]?.importMode || 'skip_existing'
      }
    })

    toast.add({
      title: t('common.success'),
      description: t('admin.toasts.imported', { count: data.length })
    })

    await refresh()
    await refreshStats()
  } catch (error) {
    console.error('Error importing students:', error)
    toast.add({
      title: t('common.error'),
      description: t('admin.toasts.cannotImport'),
      color: 'error'
    })
    throw error // Re-throw to prevent modal from closing
  }
}

// Open import modal
const openImportModal = () => {
  importModal.open({
    onImport: handleImportSubmit
  })
}
</script>

<style scoped>
.btn-secondary {
  background: linear-gradient(to right, #059669, #0d9488);
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  transform: scale(1);
}
.btn-secondary:hover {
  background: linear-gradient(to right, #047857, #0f766e);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.02);
}
</style>
