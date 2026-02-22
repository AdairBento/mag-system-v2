import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================
  // ADMIN USER
  // ============================================================
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mag.com' },
    update: {},
    create: {
      email: 'admin@mag.com',
      passwordHash,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ============================================================
  // CLIENTS
  // ============================================================
  const clientsData = [
    {
      name: 'Carlos Andrade Silva',
      email: 'carlos.andrade@email.com',
      phone: '(11) 98765-4321',
      document: '12345678901',
      documentType: 'CPF' as const,
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    {
      name: 'Mariana Costa Souza',
      email: 'mariana.costa@email.com',
      phone: '(21) 97654-3210',
      document: '98765432100',
      documentType: 'CPF' as const,
      address: 'Av. Atlântica, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22021-001',
    },
    {
      name: 'Transportes Rápidos Ltda',
      email: 'contato@transportesrapidos.com.br',
      phone: '(51) 3333-2222',
      document: '12345678000195',
      documentType: 'CNPJ' as const,
      address: 'Av. Ipiranga, 789',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90160-093',
    },
  ];

  const clients = [];
  for (const data of clientsData) {
    const existing = await prisma.client.findFirst({ where: { document: data.document } });
    if (existing) {
      clients.push(existing);
    } else {
      const client = await prisma.client.create({ data });
      clients.push(client);
    }
  }
  console.log(`✅ ${clients.length} clients seeded`);

  // ============================================================
  // VEHICLES
  // ============================================================
  const vehiclesData = [
    {
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Prata',
      registrationNumber: 'REG-001',
      chassis: 'JTDBL46E0990001',
      dailyRate: 180.0,
      mileage: 25000,
      fuelType: 'FLEX' as const,
      transmission: 'AUTOMATIC' as const,
      category: 'SEDAN' as const,
      capacity: 5,
      status: 'AVAILABLE' as const,
    },
    {
      plate: 'DEF-5678',
      brand: 'Chevrolet',
      model: 'Tracker',
      year: 2023,
      color: 'Branco',
      registrationNumber: 'REG-002',
      chassis: 'CHEVYSUV12345002',
      dailyRate: 220.0,
      mileage: 12000,
      fuelType: 'FLEX' as const,
      transmission: 'AUTOMATIC' as const,
      category: 'SUV' as const,
      capacity: 5,
      status: 'AVAILABLE' as const,
    },
    {
      plate: 'GHI-9012',
      brand: 'Volkswagen',
      model: 'Gol',
      year: 2021,
      color: 'Vermelho',
      registrationNumber: 'REG-003',
      chassis: 'VWGOLCOMPACT003',
      dailyRate: 120.0,
      mileage: 45000,
      fuelType: 'FLEX' as const,
      transmission: 'MANUAL' as const,
      category: 'COMPACT' as const,
      capacity: 5,
      status: 'AVAILABLE' as const,
    },
  ];

  const vehicles = [];
  for (const data of vehiclesData) {
    const existing = await prisma.vehicle.findFirst({ where: { plate: data.plate } });
    if (existing) {
      vehicles.push(existing);
    } else {
      const vehicle = await prisma.vehicle.create({ data });
      vehicles.push(vehicle);
    }
  }
  console.log(`✅ ${vehicles.length} vehicles seeded`);

  // ============================================================
  // DRIVERS
  // ============================================================
  const driversData = [
    {
      clientId: clients[0].id,
      name: 'Carlos Andrade Silva',
      email: 'carlos.andrade@email.com',
      phone: '(11) 98765-4321',
      document: '12345678901',
      licenseNumber: 'SP123456789',
      licenseCategory: 'B' as const,
      licenseExpiresAt: new Date('2027-06-15'),
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      status: 'ACTIVE' as const,
    },
    {
      clientId: clients[1].id,
      name: 'Mariana Costa Souza',
      email: 'mariana.costa@email.com',
      phone: '(21) 97654-3210',
      document: '98765432100',
      licenseNumber: 'RJ987654321',
      licenseCategory: 'B' as const,
      licenseExpiresAt: new Date('2026-12-01'),
      address: 'Av. Atlântica, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22021-001',
      status: 'ACTIVE' as const,
    },
    {
      name: 'João Pedro Oliveira',
      email: 'joao.pedro@email.com',
      phone: '(51) 99887-6655',
      document: '45678912300',
      licenseNumber: 'RS456789123',
      licenseCategory: 'AB' as const,
      licenseExpiresAt: new Date('2025-03-20'),
      city: 'Porto Alegre',
      state: 'RS',
      status: 'ACTIVE' as const,
    },
  ];

  const drivers = [];
  for (const data of driversData) {
    const existing = await prisma.driver.findUnique({ where: { document: data.document } });
    if (existing) {
      drivers.push(existing);
    } else {
      const driver = await prisma.driver.create({ data });
      drivers.push(driver);
    }
  }
  console.log(`✅ ${drivers.length} drivers seeded`);

  console.log('');
  console.log('🎉 Seed completed! Login credentials:');
  console.log('   Email:  admin@mag.com');
  console.log('   Senha:  Admin@123');
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
