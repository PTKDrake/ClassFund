import { pgTable, text, integer, timestamp, boolean, serial, varchar, jsonb } from "drizzle-orm/pg-core";

// Custom tables for class fund management
export const students = pgTable('students', {
  studentId: varchar('student_id').primaryKey(),
  order: integer('order_number').notNull().default(0),
  userName: text('username').notNull(),
  fullName: text('full_name').notNull(),
  hasPaid: boolean('has_paid').default(false).notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
});

// Settings table for payment configuration
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
});

// QR code cache table
export const qrCache = pgTable('qr_cache', {
  id: serial('id').primaryKey(),
  cacheKey: varchar('cache_key', { length: 32 }).notNull().unique(), // MD5 hash
  description: text('description').notNull(),
  amount: varchar('amount', { length: 20 }).notNull(),
  bankNumber: varchar('bank_number', { length: 50 }).notNull(),
  qrCodeData: jsonb('qr_code_data').notNull(), // Store full QR response data
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
});
