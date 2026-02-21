import { Test, TestingModule } from '@nestjs/testing';
import { MultasController } from '../multas.controller';
import { MultasService } from '../multas.service';

describe('MultasController', () => {
  let controller: MultasController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultasController],
      providers: [{ provide: MultasService, useValue: mockService }],
    }).compile();
    controller = module.get<MultasController>(MultasController);
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

  it('findAll should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 10 });
    const result = await controller.findAll({});
    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
