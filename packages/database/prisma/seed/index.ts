import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // TODO: Add your seed data here
  // Example for testing:
  /*
  const testUser = await prisma.user.upsert({
    where: { email: 'admin@mag-system.com' },
    update: {},
    create: {
      email: 'admin@mag-system.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Test user created:', testUser.email);
  */

  console.log('✅ Seed completed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
