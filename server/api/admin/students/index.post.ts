import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { tServer } from '~~/server/utils/i18n'
import anyAscii from "any-ascii"

export default defineEventHandler(async (event) => {

  const body = await readBody(event)
  const { order, studentId, fullName, hasPaid } = body

  if (!studentId || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: tServer('server.api.studentIdAndFullNameRequired', undefined, event)
    })
  }
  const names = fullName.split(' ')
  const userName = anyAscii(names[names.length - 1]).toLowerCase() + studentId

  try {
    const db = await useDB(event)
    const newStudent = await db
      .insert(students)
      .values({
        studentId,
        order,
        userName,
        fullName,
        hasPaid: hasPaid || false
      })
      .returning()

    return newStudent[0]
  } catch (error) {
    console.error('Error creating student:', error)
    throw createError({
      statusCode: 500,
      statusMessage: tServer('server.api.failedCreateStudentRecord', undefined, event)
    })
  }
})
