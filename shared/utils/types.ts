import type { user, students } from '~~/server/database/schema'

export type User = typeof user.$inferSelect
export type Student = typeof students.$inferSelect
export interface PaymentAddress {
  bankKey: string
  accountNumber: string
  accountHolder: string
  paymentAmount: number
}