import { PrismaClient } from '@prisma/client'

const DB_URL = "mysql://mariadb:2Pgt1yHb4zxjjB2KMzhbtllZpnn6FD1ddNdE3VJ4KvvHamwtsYmhZqYPA9mdtLdl@s4c4s0kg00cscg0ks8k8go8o:3306/ticketsystem"

const prismaClientSingleton = () => {
    return new PrismaClient({
        datasources: {
            db: {
                url: DB_URL
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
