import { PrismaClient } from '@prisma/client';
import { PrismaClient as AdminPrismaClient } from '@prisma/admin-client';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  adminPrisma: AdminPrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

export const adminPrisma =
  globalForPrisma.adminPrisma ||
  new AdminPrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.adminPrisma = adminPrisma;
}
