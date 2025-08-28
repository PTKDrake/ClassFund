import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { tServer } from '~~/server/utils/i18n'
import { eq, inArray } from "drizzle-orm"
import anyAscii from "any-ascii"

export default defineEventHandler(async (event) => {

  const body = await readBody(event)
  const { students: studentsData, importMode } = body

  if (!studentsData || !Array.isArray(studentsData)) {
    throw createError({
      statusCode: 400,
      statusMessage: tServer('server.api.invalidStudentsData', undefined, event)
    })
  }

  if (studentsData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: tServer('server.api.noStudentsToImport', undefined, event)
    })
  }

  try {
    // Validate all students data first
    const validatedStudents = studentsData.map((studentData: any, index: number) => {
      const { order, studentId, fullName } = studentData

      if (!studentId || !fullName) {
        throw createError({
          statusCode: 400,
          statusMessage: tServer('server.api.missingFieldsIndex', { index }, event)
        })
      }

      if (typeof order !== 'number' || order <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: tServer('server.api.invalidOrderIndex', { index }, event)
        })
      }

      if (studentId.length > 20) {
        throw createError({
          statusCode: 400,
          statusMessage: tServer('server.api.studentIdTooLongIndex', { index }, event)
        })
      }

      if (fullName.length > 100) {
        throw createError({
          statusCode: 400,
          statusMessage: tServer('server.api.fullNameTooLongIndex', { index }, event)
        })
      }

      // Generate username from fullName and studentId
      const names = fullName.split(' ')
      const userName = anyAscii(names[names.length - 1]).toLowerCase() + studentId

      return {
        studentId,
        order,
        userName,
        fullName,
        hasPaid: false
      }
    })

    let result: { created: number, updated: number, errors: string[] } = {
      created: 0,
      updated: 0,
      errors: []
    }

    const db = await useDB(event)

    if (importMode === 'replace_all') {
      // Replace all: Delete existing students first, then insert new ones
      await db.delete(students)
      
      const newStudents = await db
        .insert(students)
        .values(validatedStudents)
        .returning()
      
      result.created = newStudents.length

    } else if (importMode === 'update_existing') {
      // Update existing, create new ones
      const studentIds = validatedStudents.map(s => s.studentId)
      const existingStudents = await db
        .select()
        .from(students)
        .where(inArray(students.studentId, studentIds))

      const existingIds = new Set(existingStudents.map(s => s.studentId))

      // Update existing students
      for (const student of validatedStudents) {
        if (existingIds.has(student.studentId)) {
          await db
            .update(students)
            .set({
              order: student.order,
              userName: student.userName,
              fullName: student.fullName,
              updatedAt: new Date()
            })
            .where(eq(students.studentId, student.studentId))
          
          result.updated++
        } else {
          // Insert new student
          await db
            .insert(students)
            .values(student)
          
          result.created++
        }
      }

    } else {
      // Default: skip_existing - only create new students, skip duplicates
      const studentIds = validatedStudents.map(s => s.studentId)
      const existingStudents = await db
        .select({ studentId: students.studentId })
        .from(students)
        .where(inArray(students.studentId, studentIds))

      const existingIds = new Set(existingStudents.map(s => s.studentId))

      // Filter out existing students
      const newStudents = validatedStudents.filter(s => !existingIds.has(s.studentId))
      
      if (newStudents.length > 0) {
        const createdStudents = await db
          .insert(students)
          .values(newStudents)
          .returning()
        
        result.created = createdStudents.length
      }

      // Track skipped students
      const skippedCount = validatedStudents.length - newStudents.length
      if (skippedCount > 0) {
        result.errors.push(tServer('server.api.importSkippedDuplicates', { count: skippedCount }, event))
      }
    }

    return {
      success: true,
      message: tServer('server.api.importSuccess', { created: result.created, updated: result.updated }, event),
      stats: result
    }

  } catch (error: any) {
    console.error('Error importing students:', error)
    
    // Handle database constraint errors
    if (error.message?.includes('duplicate key') || error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: tServer('server.api.duplicateStudentIdFound', undefined, event)
      })
    }

    // Handle validation errors from createError
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedImportStudents', { message: error.message || 'Unknown error' }, event)
    })
  }
})
