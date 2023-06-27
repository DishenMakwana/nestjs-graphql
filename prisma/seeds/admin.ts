import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const adminSeed = async () => {
  try {
    const adminData: any = {
      email: process.env.ADMIN_EMAIL,
      password: await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        +process.env.SALT_ROUNDS
      ),
      name: 'Admin',
      role: Role.admin,
    };

    await prisma.user.upsert({
      where: { id: 1 },
      update: adminData,
      create: adminData,
    });

    console.info('Admin seeded successfully');
  } catch (error: any) {
    console.info('Error Seeding Admin : ', error);
  }
};
