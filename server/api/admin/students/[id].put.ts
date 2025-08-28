import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { eq } from "drizzle-orm"
import anyAscii from "any-ascii"
import { tServer } from '~~/server/utils/i18n'

export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { order, studentId, fullName, hasPaid } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: tServer('server.api.studentRecordIdRequired', undefined, event)
    })
  }
  const names = fullName.split(' ')
  const userName = anyAscii(names[names.length - 1]).toLowerCase() + studentId

  try {
    const db = await useDB(event)
    const updatedStudent = await db
      .update(students)
      .set({
        order,
        studentId,
        userName,
        fullName,
        hasPaid,
        updatedAt: new Date()
      })
      .where(eq(students.studentId, id))
      .returning()

    if (updatedStudent.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: tServer('server.api.studentRecordNotFound', undefined, event)
      })
    }

    return updatedStudent[0]
  } catch (error) {
    console.error('Error updating student:', error)
    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedUpdateStudentRecord', undefined, event)
    })
  }
})
