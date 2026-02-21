import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { PrismaService } from '../../../database/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrismaService: any = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.auditLog.create', async () => {
    const dto: any = { action: 'CREATE', resource: 'rental' };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.auditLog.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
  });

  it('findAll should return paginated result', async () => {
    mockPrismaService.auditLog.findMany.mockResolvedValue([]);
    mockPrismaService.auditLog.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('findRecent should return latest entries', async () => {
    const entries: any[] = [{ id: '1' }, { id: '2' }];
    mockPrismaService.auditLog.findMany.mockResolvedValue(entries);
    const result = await service.findRecent(2);
    expect(result).toHaveLength(2);
    expect(mockPrismaService.auditLog.findMany).toHaveBeenCalled();
  });
});
