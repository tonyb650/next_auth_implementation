import { PrismaClient } from "@/generated/prisma"

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient()
console.log("Creating Prisma")
console.log("process.env.NODE_ENV !== 'production' = "+ process.env.NODE_ENV !== 'production')
console.log("Done")

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma