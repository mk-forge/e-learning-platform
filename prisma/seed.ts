import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create a test user
    const user = await prisma.user.create({
        data: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            passwordHash: 'hashed_password',
            role: 'student'
        },
    })

    console.log('Created test user:', user)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })