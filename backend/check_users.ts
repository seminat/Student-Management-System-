import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      isActive: true,
    },
  });
  console.log('--- Current Users in Database ---');
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
