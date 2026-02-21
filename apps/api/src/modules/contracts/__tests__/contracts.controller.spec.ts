import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../contracts.controller';
import { ContractsService } from '../contracts.service';

describe('ContractsController', () => {
  let controller: ContractsController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [{ provide: ContractsService, useValue: mockService }],
    }).compile();
    controller = module.get<ContractsController>(ContractsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service.create', async () => {
    mockService.create.mockResolvedValue({ id: '1' });
    const dto: any = { rentalId: 'r1', fileUrl: 'http://example.com/file.pdf' };
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

  it('sign should call service.sign', async () => {
    mockService.sign.mockResolvedValue({ id: '1', status: 'SIGNED' });
    const result = await controller.sign('1');
    expect(mockService.sign).toHaveBeenCalledWith('1');
    expect(result).toBeDefined();
  });
});
