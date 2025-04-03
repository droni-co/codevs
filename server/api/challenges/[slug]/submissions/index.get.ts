import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

export default defineEventHandler( async (event) => {
  // control de acceso
  const session = await getServerSession(event)
  if (!session) { return [] }
  
  const prisma = new PrismaClient()  
  const slug = getRouterParam(event, 'slug')

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
  if (!existingSubmission) {
    return []
  }

  const submissions = await prisma.submission.findMany({
    where: {
      challengeId: challenge.id,
    },
    orderBy: {
      created_at: 'asc'
    },
    include: {
      user: true
    }
  })

  return submissions
})