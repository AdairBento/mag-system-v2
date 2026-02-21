import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from '../contracts.service';
import { PrismaService } from '../../../database/prisma.service';

describe('ContractsService', () => {
  let service: ContractsService;

  const mockPrismaService: any = {
    contract: {
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
      providers: [ContractsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<ContractsService>(ContractsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.contract.create', async () => {
    const dto: any = { rentalId: 'r1', fileUrl: 'http://example.com/file.pdf' };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.contract.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.contract.create).toHaveBeenCalled();
  });

  it('findAll should call prisma.contract.findMany and count', async () => {
    mockPrismaService.contract.findMany.mockResolvedValue([]);
    mockPrismaService.contract.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(mockPrismaService.contract.findMany).toHaveBeenCalled();
  });

  it('sign should update status to SIGNED', async () => {
    const expected: any = { id: '1', status: 'SIGNED' };
    mockPrismaService.contract.update.mockResolvedValue(expected);
    const result = await service.sign('1');
    expect(result.status).toBe('SIGNED');
    expect(mockPrismaService.contract.update).toHaveBeenCalled();
  });
});
