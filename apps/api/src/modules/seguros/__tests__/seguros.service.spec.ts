import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SegurosService } from '../seguros.service';
import { PrismaService } from '../../../database/prisma.service';

describe('SegurosService', () => {
  let service: SegurosService;

  const mockPrismaService: any = {
    insurance: {
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
      providers: [SegurosService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<SegurosService>(SegurosService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.insurance.create', async () => {
    const dto: any = {
      vehicleId: 'v1',
      provider: 'Porto Seguro',
      policyNumber: 'POL-001',
      startDate: '2026-01-01',
      endDate: '2027-01-01',
      amount: 1200,
      coverageType: 'total',
    };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.insurance.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.insurance.create).toHaveBeenCalled();
  });

  it('findAll should return paginated result', async () => {
    mockPrismaService.insurance.findMany.mockResolvedValue([]);
    mockPrismaService.insurance.count.mockResolvedValue(0);
    const result = await service.findAll({ skip: 0, take: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(mockPrismaService.insurance.findMany).toHaveBeenCalled();
  });

  it('findOne should throw NotFoundException when not found', async () => {
    mockPrismaService.insurance.findUnique.mockResolvedValue(null);
    await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('findActive should filter by ACTIVE status', async () => {
    mockPrismaService.insurance.findMany.mockResolvedValue([]);
    await service.findActive();
    expect(mockPrismaService.insurance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'ACTIVE' } })
    );
  });

  it('findByVehicle should filter by vehicleId', async () => {
    mockPrismaService.insurance.findMany.mockResolvedValue([]);
    await service.findByVehicle('v1');
    expect(mockPrismaService.insurance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { vehicleId: 'v1' } })
    );
  });

  it('update should call prisma.insurance.update', async () => {
    const existing: any = { id: '1', provider: 'Porto Seguro' };
    mockPrismaService.insurance.findUnique.mockResolvedValue(existing);
    mockPrismaService.insurance.update.mockResolvedValue({ ...existing, provider: 'Bradesco' });
    const result = await service.update('1', { provider: 'Bradesco' });
    expect(result.provider).toBe('Bradesco');
    expect(mockPrismaService.insurance.update).toHaveBeenCalled();
  });

  it('remove should call prisma.insurance.delete', async () => {
    const existing: any = { id: '1' };
    mockPrismaService.insurance.findUnique.mockResolvedValue(existing);
    mockPrismaService.insurance.delete.mockResolvedValue(existing);
    const result = await service.remove('1');
    expect(result).toEqual(existing);
    expect(mockPrismaService.insurance.delete).toHaveBeenCalled();
  });
});
