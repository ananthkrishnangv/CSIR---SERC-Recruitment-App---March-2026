const { PrismaClient } = require('@prisma/admin-client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@csir.res.in' },
    update: {},
    create: {
      email: 'admin@csir.res.in',
      password: 'adminpassword',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
