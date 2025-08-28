import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { tServer } from '~~/server/utils/i18n'
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: tServer('server.api.studentRecordIdRequired', undefined, event)
    })
  }

  try {
    const db = await useDB(event)
    const deletedStudent = await db
        .delete(students)
      .where(eq(students.studentId, id))
      .returning()

    if (deletedStudent.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: tServer('server.api.studentRecordNotFound', undefined, event)
      })
    }

    return { success: true, deletedStudent: deletedStudent[0] }
  } catch (error) {
    console.error('Error deleting student:', error)
    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedDeleteStudentRecord', undefined, event)
    })
  }
})
