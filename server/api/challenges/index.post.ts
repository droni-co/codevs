import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'

export default defineEventHandler( async (event) => {
  const prisma = new PrismaClient()

  const { name, funcName, description, content, level } = await readBody(event)

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
      userId: '1',
    }
  })

  return result
})