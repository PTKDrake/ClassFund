import { useDB } from "~~/server/utils/db"
import { students } from "~~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
  const userName = getRouterParam(event, 'userName')
  
  if (!userName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Student ID is required'
    })
  }

  try {
    const db = await useDB(event)
    const student = await db
      .select()
      .from(students)
      .where(eq(students.userName, userName))
      .limit(1)
    
    if (student.length === 0) {
      return { found: false }
    }
    
    return { 
      found: true, 
      student: student[0]
    }
  } catch (error) {
    console.error('Error fetching student:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch student'
    })
  }
})
