import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../database/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prismaService: PrismaService;

  const mockClient = {
    id: '123',
    name: 'Test Client',
    email: 'test@client.com',
    phone: '11999999999',
    document: '12345678900',
    address: 'Test Address',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345-678',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createDto = {
        name: 'Test Client',
        email: 'test@client.com',
        phone: '11999999999',
        document: '12345678900',
        address: 'Test Address',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345-678',
      };

      mockPrismaService.client.create.mockResolvedValue(mockClient);

      const result = await service.create(createDto);

      expect(prismaService.client.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('findAll', () => {
    it('should return paginated clients', async () => {
      const filter = { skip: 0, take: 10 };

      mockPrismaService.client.findMany.mockResolvedValue([mockClient]);
      mockPrismaService.client.count.mockResolvedValue(1);

      const result = await service.findAll(filter);

      expect(prismaService.client.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: [mockClient],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });

    it('should use default pagination values when filter is empty', async () => {
      mockPrismaService.client.findMany.mockResolvedValue([mockClient]);
      mockPrismaService.client.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(prismaService.client.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a single client', async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne('123');

      expect(prismaService.client.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateDto = { name: 'Updated Client' };

      mockPrismaService.client.update.mockResolvedValue({
        ...mockClient,
        ...updateDto,
      });

      const result = await service.update('123', updateDto);

      expect(prismaService.client.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: updateDto,
      });
      expect(result.name).toBe('Updated Client');
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      mockPrismaService.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove('123');

      expect(prismaService.client.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockClient);
    });
  });
});
