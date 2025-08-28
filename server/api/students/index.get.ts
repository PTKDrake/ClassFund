import { defineEventHandler, getQuery, sendError, createError } from 'h3'
import { useDB } from '~~/server/utils/db'
import { students } from '~~/server/database/schema'
import { eq, ilike, and, or, asc, desc, count } from 'drizzle-orm'
import { filterSchema, processFilters, withFilters } from '~~/server/utils/query'
import { z } from 'zod'

// Enhanced query schema supporting advanced filtering like NuxSaaS
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10), // NuxSaaS uses 'limit' instead of 'pageSize'
  sort: z.string().optional().default('order'),
  dir: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
  // NuxSaaS-style advanced filtering
  filter: z.string().optional().transform((val) => {
    if (!val) return []
    try {
      const parsed = JSON.parse(val)
      return filterSchema.parse(parsed)
    } catch {
      return []
    }
  }),
  // Legacy filter support for existing frontend
  hasPaid: z.enum(['paid', 'unpaid', 'all']).optional().transform(val => {
    if (val === 'paid') return true
    if (val === 'unpaid') return false
    return undefined
  })
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { page, limit, sort, dir, search, filter, hasPaid } = querySchema.parse(query)
    
    const db = await useDB(event)
    const offset = (page - 1) * limit

    // Validate sort field to prevent injection
    const allowedSortFields = ['studentId', 'userName', 'fullName', 'hasPaid', 'order', 'createdAt', 'updatedAt']
    const sortField = allowedSortFields.includes(sort) ? sort as keyof typeof students.$inferSelect : 'order'
    
    // Build base queries
    let countQuery = db.select({ count: count() }).from(students).$dynamic()
    let selectQuery = db.select().from(students).$dynamic()

    // Apply advanced filtering (NuxSaaS style)
    const sqlFilters = processFilters(filter, {
      studentId: students.studentId,
      userName: students.userName,
      fullName: students.fullName,
      hasPaid: students.hasPaid,
      order: students.order,
      createdAt: students.createdAt,
      updatedAt: students.updatedAt
    })

    // Legacy search support
    if (search) {
      sqlFilters.push(
        or(
          ilike(students.userName, `%${search}%`),
          ilike(students.fullName, `%${search}%`)
        )!
      )
    }

    // Legacy hasPaid filter support
    if (hasPaid !== undefined) {
      sqlFilters.push(eq(students.hasPaid, hasPaid))
    }

    // Apply filters to queries
    countQuery = withFilters(countQuery, sqlFilters)
    selectQuery = withFilters(selectQuery, sqlFilters)

    // Apply sorting and pagination
    selectQuery = selectQuery
      .orderBy(dir === 'asc' ? asc(students[sortField]) : desc(students[sortField]))
      .limit(limit)
      .offset(offset)

    // Execute queries in parallel
    const [totalResult, items] = await Promise.all([
      countQuery,
      selectQuery
    ])

    const total = totalResult[0].count
    const pageCount = Math.ceil(Number(total) / limit)

    // NuxSaaS-style response format
    return {
      data: items,
      total: Number(total),
      page,
      limit,
      pageCount,
      // Legacy support
      pageSize: limit,
      students: items
    }

  } catch (error: any) {
    console.error('Students API Error:', error)
    
    // Handle validation errors specifically
    if (error.name === 'ZodError') {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Invalid query parameters',
        data: error.errors
      }))
    }
    
    return sendError(event, createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    }))
  }
})

