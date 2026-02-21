import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';

/**
 * Mock user returned by prisma.user.findUnique during JWT validation.
 * JwtStrategy calls prisma.user.findUnique after verifying the token signature,
 * so this must return a non-null value for auth to succeed.
 */
const MOCK_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
  password: '$2b$10$hashed',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Build a comprehensive Prisma mock whose delegates support all
 * common query operations. Individual tests override specific methods
 * with jest.fn() calls as needed.
 *
 * user.findUnique defaults to returning MOCK_USER so JWT validation
 * succeeds without extra setup in every test.
 */
export function buildPrismaMock() {
  const delegate = () => ({
    create: jest.fn().mockResolvedValue({}),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue(null),
    findFirst: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    count: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockResolvedValue({ _sum: {}, _avg: {}, _count: {} }),
    groupBy: jest.fn().mockResolvedValue([]),
    upsert: jest.fn().mockResolvedValue({}),
  });

  return {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    client: delegate(),
    driver: delegate(),
    vehicle: delegate(),
    rental: delegate(),
    inspection: delegate(),
    contract: delegate(),
    maintenance: delegate(),
    fine: delegate(),
    accident: delegate(),
    accidentDocument: delegate(),
    invoice: delegate(),
    transaction: delegate(),
    setting: delegate(),
    damage: delegate(),
    inspectionPhoto: delegate(),
    insurance: delegate(),
    auditLog: delegate(),
    // user.findUnique must return a real user so JwtStrategy.validate() succeeds
    user: {
      ...delegate(),
      findUnique: jest.fn().mockResolvedValue(MOCK_USER),
    },
    refreshToken: delegate(),
  };
}

/**
 * Creates and initialises the full NestJS app for e2e tests:
 * - PrismaService overridden with in-memory jest mocks (no real DB)
 * - user.findUnique pre-seeded with MOCK_USER so JWT auth succeeds
 * - JwtService used to sign a test token (same secret as production)
 * - Same ValidationPipe and global prefix as production
 *
 * Returns { app, prisma, token } where token is a valid Bearer token
 * for use in Authorization headers.
 */
export async function createTestApp(
  prismaMock = buildPrismaMock()
): Promise<{ app: INestApplication; prisma: ReturnType<typeof buildPrismaMock>; token: string }> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaMock)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  await app.init();

  // Sign a test JWT using the same JwtService instance (same secret as JwtStrategy)
  const jwtService = app.get(JwtService);
  const token = jwtService.sign({
    sub: 'test-user-id',
    email: 'test@example.com',
    role: 'ADMIN',
  });

  return { app, prisma: prismaMock, token };
}
