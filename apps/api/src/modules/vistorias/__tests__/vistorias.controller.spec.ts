import { Test, TestingModule } from '@nestjs/testing';
import { VistoriasController } from '../vistorias.controller';
import { VistoriasService } from '../vistorias.service';

describe('VistoriasController', () => {
  let controller: VistoriasController;

  const mockService: any = {
    createDamage: jest.fn(),
    findDamagesByInspection: jest.fn(),
    updateDamage: jest.fn(),
    removeDamage: jest.fn(),
    createPhoto: jest.fn(),
    findPhotosByInspection: jest.fn(),
    removePhoto: jest.fn(),
    getInspectionSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VistoriasController],
      providers: [{ provide: VistoriasService, useValue: mockService }],
    }).compile();
    controller = module.get<VistoriasController>(VistoriasController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createDamage should call service.createDamage', async () => {
    mockService.createDamage.mockResolvedValue({ id: 'd1' });
    const dto: any = {};
    const result = await controller.createDamage(dto);
    expect(mockService.createDamage).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('getInspectionSummary should call service.getInspectionSummary', async () => {
    mockService.getInspectionSummary.mockResolvedValue({
      damages: { count: 0, totalCost: 0 },
      photos: { count: 0 },
    });
    const result = await controller.getInspectionSummary('i1');
    expect(mockService.getInspectionSummary).toHaveBeenCalledWith('i1');
    expect(result).toBeDefined();
  });
});
