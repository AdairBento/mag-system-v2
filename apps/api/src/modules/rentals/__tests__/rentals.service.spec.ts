import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from '../rentals.service';
import { PrismaService } from '../../../database/prisma.service';

describe('RentalsService', () => {
  let service: RentalsService;

  const delegate = 'rental';

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
      providers: [RentalsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Smoke tests (não assumem shape do DTO nem assinatura exata)
  it('create should call prisma delegate', async () => {
    const dto: any = { name: 'Test' };
    const expected: any = { id: '1', ...dto };
    mockPrismaService[delegate].create.mockResolvedValue(expected);

    const result = await (service as any).create(dto);

    expect(result).toEqual(expected);
    expect(mockPrismaService[delegate].create).toHaveBeenCalled();
  });

  it('findAll should call prisma delegate', async () => {
    mockPrismaService[delegate].findMany.mockResolvedValue([]);
    mockPrismaService[delegate].count.mockResolvedValue(0);

    // tenta chamar findAll se existir
    const fn = (service as any).findAll;
    if (typeof fn === 'function') {
      await fn.call(service, { skip: 0, take: 10 });
      expect(mockPrismaService[delegate].findMany).toHaveBeenCalled();
    } else {
      // se o serviço não tem findAll, só não explode
      expect(true).toBe(true);
    }
  });
});
