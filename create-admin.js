const { PrismaClient } = require('@prisma/admin-client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@csir.res.in';
  const adminPassword = 'adminpassword';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('Created admin user:', admin);
  } else {
    console.log('Admin user already exists:', existingAdmin);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
