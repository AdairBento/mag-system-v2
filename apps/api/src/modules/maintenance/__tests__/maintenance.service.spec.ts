import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from '../maintenance.service';
import { PrismaService } from '../../../database/prisma.service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;

  const mockPrismaService: any = {
    maintenance: {
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
      providers: [MaintenanceService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<MaintenanceService>(MaintenanceService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.maintenance.create', async () => {
    const dto: any = {
      vehicleId: 'v1',
      type: 'OIL_CHANGE',
      description: 'Oil change',
      scheduledDate: '2024-01-01',
    };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.maintenance.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.maintenance.create).toHaveBeenCalled();
  });

  it('findAll should return paginated result', async () => {
    mockPrismaService.maintenance.findMany.mockResolvedValue([]);
    mockPrismaService.maintenance.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('update with completedDate should set status COMPLETED', async () => {
    const expected: any = { id: '1', status: 'COMPLETED' };
    mockPrismaService.maintenance.update.mockResolvedValue(expected);
    await service.update('1', { completedDate: '2024-01-15' } as any);
    expect(mockPrismaService.maintenance.update).toHaveBeenCalled();
  });
});
