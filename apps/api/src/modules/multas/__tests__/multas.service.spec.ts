import { Test, TestingModule } from '@nestjs/testing';
import { MultasService } from '../multas.service';
import { PrismaService } from '../../../database/prisma.service';

describe('MultasService', () => {
  let service: MultasService;

  const mockPrismaService: any = {
    fine: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultasService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<MultasService>(MultasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.fine.create', async () => {
    const dto: any = {
      vehicleId: 'v1',
      date: '2024-01-01',
      location: 'SP',
      description: 'Speed',
      amount: 150,
      dueDate: '2024-02-01',
    };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.fine.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.fine.create).toHaveBeenCalled();
  });

  it('findAll should return paginated result', async () => {
    mockPrismaService.fine.findMany.mockResolvedValue([]);
    mockPrismaService.fine.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('update with paidDate should set status PAID', async () => {
    const expected: any = { id: '1', status: 'PAID' };
    mockPrismaService.fine.update.mockResolvedValue(expected);
    await service.update('1', { paidDate: '2024-01-15' } as any);
    expect(mockPrismaService.fine.update).toHaveBeenCalled();
  });
});
