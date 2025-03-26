import { PrismaClient } from '@prisma/client'

export default defineEventHandler( async () => {
  const prisma = new PrismaClient()

  const challenge = await prisma.challenge.findFirst({
    orderBy: {
      created_at: 'desc'
    }
  })
  return challenge
})