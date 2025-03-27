import { PrismaClient } from '@prisma/client'
import crypto from 'node:crypto'
import { getServerSession } from '#auth'

export default defineEventHandler( async (event) => {
  // control de acceso
  const session = await getServerSession(event)
  if (!session) { throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 }) }
  
  const prisma = new PrismaClient()  
  const { name, funcName, description, content, level, scaffold, tests } = await readBody(event)
  
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: String(session.user?.email)
    }
  })

  const challenge = await prisma.challenge.create({
    data: {
      id: crypto.randomUUID(),
      slug: funcName+'-'+Math.floor(Math.random()*1000),
      name,
      description,
      content,
      scaffold,
      funcName,
      level,
      created_at: new Date(),
      userId: user.id,
    }
  })

  await prisma.test.createMany({
    data: tests.map((test: { inputs: string; output: string }) => ({
      id: crypto.randomUUID(),
      inputs: test.inputs,
      output: test.output,
      challengeId: challenge.id,
    }))
  })


  return challenge
})