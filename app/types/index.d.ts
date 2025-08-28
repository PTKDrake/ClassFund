export interface Student {
    studentId: string
    order: number
    userName: string
    fullName: string
    hasPaid: boolean
    createdAt: string
    updatedAt: string
}

export interface StatsResponse {
  totalCount: number
  paidCount: number
  unpaidCount: number
}