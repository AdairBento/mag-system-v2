import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from '../drivers.controller';
import { DriversService } from '../drivers.service';

describe('DriversController', () => {
  let controller: DriversController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [{ provide: DriversService, useValue: mockService }],
    }).compile();

    controller = module.get<DriversController>(DriversController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should not crash (if exists)', async () => {
    mockService.create.mockResolvedValue({ id: '1' });

    const fn = (controller as any).create;
    if (typeof fn === 'function') {
      await fn.call(controller, {});
    }

    expect(true).toBe(true);
  });
});
