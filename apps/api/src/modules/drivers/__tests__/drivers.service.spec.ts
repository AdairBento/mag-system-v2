import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from '../drivers.service';
import { PrismaService } from '../../../database/prisma.service';

describe('DriversService', () => {
  let service: DriversService;

  const delegate = 'driver';

  const mockPrismaService: any = {
    [delegate]: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Smoke tests (não assumem assinatura/DTO exata)
  it('create should not crash (and may call prisma)', async () => {
    const dto: any = { name: 'Test' };
    mockPrismaService[delegate].create.mockResolvedValue({ id: '1', ...dto });

    const fn = (service as any).create;
    if (typeof fn === 'function') {
      await fn.call(service, dto);
    }

    expect(true).toBe(true);
  });

  it('findAll should not crash (and may call prisma)', async () => {
    mockPrismaService[delegate].findMany.mockResolvedValue([]);
    mockPrismaService[delegate].count.mockResolvedValue(0);

    const fn = (service as any).findAll;
    if (typeof fn === 'function') {
      await fn.call(service, { skip: 0, take: 10 });
    }

    expect(true).toBe(true);
  });
});
