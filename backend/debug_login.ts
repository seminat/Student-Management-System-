import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function debugLogin() {
  const email = 'admin@school.com';
  const password = 'admin123';

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('User admin@school.com NOT FOUND');
  } else {
    console.log('User found. Hash:', user.passwordHash);
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log('Comparison result with "admin123":', isValid);
  }

  await prisma.$disconnect();
}

debugLogin();
