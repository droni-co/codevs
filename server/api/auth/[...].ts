import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    }),
  ],
  callbacks: {
    /* on before signin */
    async signIn({ user, account }) {

      if (user && account) {
        const prisma = new PrismaClient()
        await prisma.user.upsert({
          where: {
            email: String(user.email)
          },
          update: {
            name: String(user.name),
            picture: String(user.image),
          },
          create: {
            id: String(account.providerAccountId),
            name: String(user.name),
            email: String(user.email),
            picture: String(user.image),
            created_at: new Date()
          }
        })
      }      
      return true
    }
  }
})