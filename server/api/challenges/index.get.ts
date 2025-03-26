import { PrismaClient } from '@prisma/client'

export default defineEventHandler( async () => {
  const prisma = new PrismaClient()

  const challenges = await prisma.challenge.findMany({
    orderBy: {
      created_at: 'desc'
    },
    take: 10
  })
  return challenges
})