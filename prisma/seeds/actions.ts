import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const actionSeed = async () => {
  // delete all existing records
  await prisma.action.deleteMany();

  try {
    const actions = [
      {
        id: 1,
        name: 'Log In',
      },
      {
        id: 2,
        name: 'Log Out',
      },
      {
        id: 3,
        name: 'Forgot Password',
      },
      {
        id: 4,
        name: 'Reset Password',
      },
      {
        id: 5,
        name: 'Create User',
      },
      {
        id: 6,
        name: 'Update User',
      },
      {
        id: 7,
        name: 'Delete User',
      },
      {
        id: 8,
        name: 'OTP Verify',
      },
    ];

    await prisma.action.createMany({
      data: actions,
    });

    console.info('Action seeded successfully');
  } catch (error: any) {
    console.info('Error Seeding Action : ', error.message);
  }
};
