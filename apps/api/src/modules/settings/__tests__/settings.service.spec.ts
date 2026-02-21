import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings.service';
import { PrismaService } from '../../../database/prisma.service';

describe('SettingsService', () => {
  let service: SettingsService;

  const mockPrismaService: any = {
    setting: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<SettingsService>(SettingsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call prisma.setting.create', async () => {
    const dto: any = { key: 'theme', value: 'dark' };
    const expected: any = { id: '1', ...dto, type: 'string' };
    mockPrismaService.setting.create.mockResolvedValue(expected);
    const result = await service.create(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.setting.create).toHaveBeenCalled();
  });

  it('findByKey should call prisma.setting.findUnique with key', async () => {
    const expected: any = { id: '1', key: 'theme', value: 'dark' };
    mockPrismaService.setting.findUnique.mockResolvedValue(expected);
    const result = await service.findByKey('theme');
    expect(result).toEqual(expected);
    expect(mockPrismaService.setting.findUnique).toHaveBeenCalledWith({ where: { key: 'theme' } });
  });

  it('upsert should call prisma.setting.upsert', async () => {
    const expected: any = { id: '1', key: 'theme', value: 'light' };
    mockPrismaService.setting.upsert.mockResolvedValue(expected);
    const result = await service.upsert('theme', 'light');
    expect(result).toEqual(expected);
    expect(mockPrismaService.setting.upsert).toHaveBeenCalled();
  });
});
