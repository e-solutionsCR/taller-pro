const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@tallerpro.com';
    const password = 'admin';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            nombre: 'Administrador',
            email,
            password: hashedPassword,
            rol: 'ADMIN',
            activo: true
        }
    });
    console.log('Admin user created successfully.');
    console.log('Email: admin@tallerpro.com');
    console.log('Password: admin');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
