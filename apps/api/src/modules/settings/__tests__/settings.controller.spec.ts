import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '../settings.controller';
import { SettingsService } from '../settings.service';

describe('SettingsController', () => {
  let controller: SettingsController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByKey: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [{ provide: SettingsService, useValue: mockService }],
    }).compile();
    controller = module.get<SettingsController>(SettingsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const dto: any = { key: 'theme', value: 'dark' };
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('findByKey should call service.findByKey', async () => {
    mockService.findByKey.mockResolvedValue({ id: '1', key: 'theme' });
    const result = await controller.findByKey('theme');
    expect(mockService.findByKey).toHaveBeenCalledWith('theme');
    expect(result).toBeDefined();
  });
});
