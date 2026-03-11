const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@csir.res.in';
  const adminPassword = 'adminpassword';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        name: 'Administrator',
      },
    });
    console.log('Created admin user in main DB:', admin);
  } else {
    if (existingAdmin.role !== 'ADMIN' || existingAdmin.password !== adminPassword) {
      const updatedAdmin = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN', password: adminPassword }
      });
      console.log('Updated admin user in main DB:', updatedAdmin);
    } else {
      console.log('Admin user already exists in main DB:', existingAdmin);
    }
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
