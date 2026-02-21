import { Test, TestingModule } from '@nestjs/testing';
import { VistoriasService } from '../vistorias.service';
import { PrismaService } from '../../../database/prisma.service';

describe('VistoriasService', () => {
  let service: VistoriasService;

  const mockPrismaService: any = {
    damage: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    inspectionPhoto: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VistoriasService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<VistoriasService>(VistoriasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createDamage should call prisma.damage.create', async () => {
    const dto: any = {
      inspectionId: 'i1',
      description: 'Scratch',
      severity: 'MINOR',
      location: 'Front',
    };
    const expected: any = { id: 'd1', ...dto };
    mockPrismaService.damage.create.mockResolvedValue(expected);
    const result = await service.createDamage(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.damage.create).toHaveBeenCalled();
  });

  it('createPhoto should call prisma.inspectionPhoto.create', async () => {
    const dto: any = { inspectionId: 'i1', url: 'http://example.com/photo.jpg' };
    const expected: any = { id: 'p1', ...dto };
    mockPrismaService.inspectionPhoto.create.mockResolvedValue(expected);
    const result = await service.createPhoto(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.inspectionPhoto.create).toHaveBeenCalled();
  });

  it('getInspectionSummary should return damages and photos count', async () => {
    mockPrismaService.damage.findMany.mockResolvedValue([
      { estimatedCost: 100 },
      { estimatedCost: 200 },
    ]);
    mockPrismaService.inspectionPhoto.count.mockResolvedValue(5);
    const result = await service.getInspectionSummary('i1');
    expect(result.damages.count).toBe(2);
    expect(result.damages.totalCost).toBe(300);
    expect(result.photos.count).toBe(5);
  });
});
