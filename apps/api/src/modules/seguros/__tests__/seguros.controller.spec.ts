import { Test, TestingModule } from '@nestjs/testing';
import { SegurosController } from '../seguros.controller';
import { SegurosService } from '../seguros.service';

describe('SegurosController', () => {
  let controller: SegurosController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findActive: jest.fn(),
    findByVehicle: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SegurosController],
      providers: [{ provide: SegurosService, useValue: mockService }],
    }).compile();
    controller = module.get<SegurosController>(SegurosController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    const dto: any = {
      vehicleId: 'v1',
      provider: 'Porto Seguro',
      policyNumber: 'POL-001',
      startDate: '2026-01-01',
      endDate: '2027-01-01',
      amount: 1200,
      coverageType: 'total',
    };
    mockService.create.mockResolvedValue({ id: '1', ...dto });
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('findAll should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 10 });
    const result = await controller.findAll({});
    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('findActive should call service.findActive', async () => {
    mockService.findActive.mockResolvedValue([]);
    const result = await controller.findActive();
    expect(mockService.findActive).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('findByVehicle should call service.findByVehicle', async () => {
    mockService.findByVehicle.mockResolvedValue([]);
    const result = await controller.findByVehicle('v1');
    expect(mockService.findByVehicle).toHaveBeenCalledWith('v1');
    expect(result).toEqual([]);
  });

  it('findOne should call service.findOne', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    const result = await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith('1');
    expect(result).toBeDefined();
  });

  it('update should call service.update', async () => {
    mockService.update.mockResolvedValue({ id: '1', provider: 'Bradesco' });
    const result = await controller.update('1', { provider: 'Bradesco' });
    expect(mockService.update).toHaveBeenCalledWith('1', { provider: 'Bradesco' });
    expect(result).toBeDefined();
  });

  it('remove should call service.remove', async () => {
    mockService.remove.mockResolvedValue({ id: '1' });
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
