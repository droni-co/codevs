import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'
import { getServerSession } from '#auth'

export default defineEventHandler( async (event) => {
  const prisma = new PrismaClient()  
  const { name, funcName, description, content, level } = await readBody(event)
  const session = await getServerSession(event)
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: String(session?.user?.email)
    }
  })

  const result = await prisma.challenge.create({
    data: {
      id: crypto.randomUUID(),
      slug: funcName,
      name,
      description,
      content,
      funcName,
      level,
      created_at: new Date(),
      userId: user.id,
    }
  })

  return result
})