const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];

  if (!email || !password || !name) {
    console.error('Usage: ts-node create-admin.ts <email> <password> <name>');
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
      },
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 