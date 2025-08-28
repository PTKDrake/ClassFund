import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { count, eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  try {
    const db = await useDB(event)
    // Get paid count
    const [{ paidCount }] = await db
      .select({ paidCount: count() })
      .from(students)
      .where(eq(students.hasPaid, true))

    // Get unpaid count
    const [{ unpaidCount }] = await db
      .select({ unpaidCount: count() })
      .from(students)
      .where(eq(students.hasPaid, false))

    return {
      totalCount: paidCount + unpaidCount,
      paidCount,
      unpaidCount
    }
  } catch (error) {
    console.error('Error fetching student statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student statistics'
    })
  }
})
