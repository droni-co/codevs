import { PrismaClient } from '@prisma/client'

export default defineEventHandler( async (event) => {
  const prisma = new PrismaClient()
  const slug = getRouterParam(event, 'slug')

  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: String(slug)
    }
  })
  return challenge
})