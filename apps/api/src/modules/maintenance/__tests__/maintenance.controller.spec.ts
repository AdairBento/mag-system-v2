import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceController } from '../maintenance.controller';
import { MaintenanceService } from '../maintenance.service';

describe('MaintenanceController', () => {
  let controller: MaintenanceController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByVehicle: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [{ provide: MaintenanceService, useValue: mockService }],
    }).compile();
    controller = module.get<MaintenanceController>(MaintenanceController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const dto: any = {};
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('findByVehicle should call service.findByVehicle', async () => {
    mockService.findByVehicle.mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 10 });
    const result = await controller.findByVehicle('v1', {});
    expect(mockService.findByVehicle).toHaveBeenCalledWith('v1', {});
    expect(result).toBeDefined();
  });
});
