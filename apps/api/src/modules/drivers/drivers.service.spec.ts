import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';

describe('DriversService', () => {
  let service: DriversService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    driver: {
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
      providers: [
        DriversService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new driver', async () => {
      const dto: CreateDriverDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11987654321',
        document: '12345678900',
        licenseNumber: 'ABC12345',
        licenseCategory: 'B',
        licenseExpiresAt: '2025-12-31',
      };

      const expectedResult = {
        id: '1',
        ...dto,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.driver.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
      expect(prismaService.driver.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated drivers', async () => {
      const filter: FilterDriverDto = {
        skip: 0,
        take: 10,
      };

      const expectedDrivers = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@example.com',
          phone: '11987654321',
          document: '12345678900',
          licenseNumber: 'ABC12345',
          licenseCategory: 'B',
          licenseExpiresAt: '2025-12-31',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.driver.findMany.mockResolvedValue(expectedDrivers);
      mockPrismaService.driver.count.mockResolvedValue(1);

      const result = await service.findAll(filter);

      expect(result).toBeDefined();
      expect(result.data).toEqual(expectedDrivers);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(prismaService.driver.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(prismaService.driver.count).toHaveBeenCalled();
    });

    it('should use default pagination values when filter is empty', async () => {
      const filter: FilterDriverDto = {};

      mockPrismaService.driver.findMany.mockResolvedValue([]);
      mockPrismaService.driver.count.mockResolvedValue(0);

      const result = await service.findAll(filter);

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(prismaService.driver.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single driver', async () => {
      const driverId = '1';
      const expectedDriver = {
        id: driverId,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11987654321',
        document: '12345678900',
        licenseNumber: 'ABC12345',
        licenseCategory: 'B',
        licenseExpiresAt: '2025-12-31',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.driver.findUnique.mockResolvedValue(expectedDriver);

      const result = await service.findOne(driverId);

      expect(result).toEqual(expectedDriver);
      expect(prismaService.driver.findUnique).toHaveBeenCalledWith({
        where: { id: driverId },
      });
    });
  });

  describe('update', () => {
    it('should update a driver', async () => {
      const driverId = '1';
      const updateDto = {
        name: 'João Silva Atualizado',
        phone: '11999999999',
      };

      const expectedResult = {
        id: driverId,
        name: 'João Silva Atualizado',
        email: 'joao.silva@example.com',
        phone: '11999999999',
        document: '12345678900',
        licenseNumber: 'ABC12345',
        licenseCategory: 'B',
        licenseExpiresAt: '2025-12-31',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.driver.update.mockResolvedValue(expectedResult);

      const result = await service.update(driverId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.driver.update).toHaveBeenCalledWith({
        where: { id: driverId },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a driver', async () => {
      const driverId = '1';
      const expectedResult = {
        id: driverId,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '11987654321',
        document: '12345678900',
        licenseNumber: 'ABC12345',
        licenseCategory: 'B',
        licenseExpiresAt: '2025-12-31',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.driver.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(driverId);

      expect(result).toEqual(expectedResult);
      expect(prismaService.driver.delete).toHaveBeenCalledWith({
        where: { id: driverId },
      });
    });
  });
});
