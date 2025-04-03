import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'
import { getServerSession } from '#auth'

export default defineEventHandler( async (event) => {
  // control de acceso
  const session = await getServerSession(event)
  if (!session) { throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 }) }
  
  const prisma = new PrismaClient()  
  const { code, complete_time } = await readBody(event)
  const slug = getRouterParam(event, 'slug')

  if (!slug || !code || !complete_time) {
    throw createError({ statusMessage: 'Bad Request', statusCode: 400 })
  }
  
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: String(session.user?.email)
    }
  })

  // Check if the challenge exists
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: {
      slug: slug
    }
  })

  // Check if the user has already submitted a solution for this challenge
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      userId: user.id,
      challengeId: challenge.id
    }
  })
  if (existingSubmission) {
    throw createError({ statusMessage: 'Already submitted', statusCode: 400 })
  }

  const submission = await prisma.submission.create({
    data: {
      id: crypto.randomUUID(),
      challengeId: challenge.id,
      code,
      complete: true,
      complete_time,
      votes: 0,
      rank: 0,
      created_at: new Date(),
      userId: user.id,
    }
  })


  return submission
})