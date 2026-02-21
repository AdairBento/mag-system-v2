import { Test, TestingModule } from '@nestjs/testing';
import { SinistrosService } from '../sinistros.service';
import { PrismaService } from '../../../database/prisma.service';

describe('SinistrosService', () => {
  let service: SinistrosService;

  const mockPrismaService: any = {
    accident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    accidentDocument: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinistrosService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<SinistrosService>(SinistrosService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.accident.create', async () => {
    const dto: any = {
      vehicleId: 'v1',
      date: '2024-01-01',
      location: 'SP',
      description: 'Crash',
      severity: 'MINOR',
    };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.accident.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.accident.create).toHaveBeenCalled();
  });

  it('findAll should return paginated result', async () => {
    mockPrismaService.accident.findMany.mockResolvedValue([]);
    mockPrismaService.accident.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('addDocument should call prisma.accidentDocument.create', async () => {
    const expected: any = { id: 'd1', accidentId: 'a1', type: 'PHOTO', url: 'http://example.com' };
    mockPrismaService.accidentDocument.create.mockResolvedValue(expected);
    const result = await service.addDocument('a1', { type: 'PHOTO', url: 'http://example.com' });
    expect(result).toEqual(expected);
    expect(mockPrismaService.accidentDocument.create).toHaveBeenCalled();
  });
});
