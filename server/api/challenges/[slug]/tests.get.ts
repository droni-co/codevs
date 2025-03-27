import { PrismaClient } from '@prisma/client'

export default defineEventHandler( async (event) => {
  const slug = getRouterParam(event, 'slug')
  const prisma = new PrismaClient()

  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: String(slug)
    }
  })

  const tests = await prisma.test.findMany({
    where: {
      challengeId: challenge?.id
    }
  })
  return tests
})