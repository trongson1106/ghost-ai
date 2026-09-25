import { PrismaClient } from '@/app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const databaseUrl = process.env.DATABASE_URL ?? ''

function makeClient() {
  if (databaseUrl.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: databaseUrl }).$extends(
      withAccelerate()
    )
  }
  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makeClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
