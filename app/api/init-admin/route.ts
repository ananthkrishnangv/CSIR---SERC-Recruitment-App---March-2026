import { NextResponse } from "next/server";
import { adminPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminEmail = 'admin@csir.res.in';
    const adminPassword = 'adminpassword';

    const existingAdmin = await adminPrisma.adminUser.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const admin = await adminPrisma.adminUser.create({
        data: {
          email: adminEmail,
          password: adminPassword,
          role: 'ADMIN',
        },
      });
      return NextResponse.json({ message: 'Created admin user in admin DB', admin });
    } else {
      if (existingAdmin.role !== 'ADMIN' || existingAdmin.password !== adminPassword) {
        const updatedAdmin = await adminPrisma.adminUser.update({
          where: { email: adminEmail },
          data: { role: 'ADMIN', password: adminPassword }
        });
        return NextResponse.json({ message: 'Updated admin user in admin DB', updatedAdmin });
      } else {
        return NextResponse.json({ message: 'Admin user already exists in admin DB', existingAdmin });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
