import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create PrismaClient if we have a valid database URL
// On Vercel, the app uses Supabase for data, so Prisma is optional
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
  } catch {
    console.warn('[Aether] Prisma client could not be initialized. Using Supabase for data.')
    return null as unknown as PrismaClient
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
