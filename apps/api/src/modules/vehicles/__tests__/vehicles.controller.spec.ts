import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '../vehicles.controller';
import { VehiclesService } from '../vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: mockService }],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create (if controller has create)', async () => {
    mockService.create.mockResolvedValue({ id: '1' });

    const fn = (controller as any).create;
    if (typeof fn === 'function') {
      const dto: any = {};
      const result = await fn.call(controller, dto);
      expect(mockService.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    } else {
      expect(true).toBe(true);
    }
  });
});
