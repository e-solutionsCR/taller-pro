import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL
    console.log('--- PRISMA DEBUG ---')
    console.log('URL length:', url?.length)
    console.log('URL starts with:', url?.substring(0, 10))

    return new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
