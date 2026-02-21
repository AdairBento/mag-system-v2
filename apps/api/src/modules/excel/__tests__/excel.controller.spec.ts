import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from '../excel.controller';
import { ExcelService } from '../excel.service';

describe('ExcelController', () => {
  let controller: ExcelController;

  const mockService: any = {
    generate: jest.fn(),
    generateRentals: jest.fn(),
    generateFinancial: jest.fn(),
    generateFleet: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
      providers: [{ provide: ExcelService, useValue: mockService }],
    }).compile();
    controller = module.get<ExcelController>(ExcelController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('generate should call service.generate', () => {
    mockService.generate.mockReturnValue({ data: '', filename: 'test.csv', mimeType: 'text/csv' });
    const dto: any = { report: 'RENTALS' };
    const result = controller.generate(dto);
    expect(mockService.generate).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('generateRentals should call service.generateRentals', () => {
    mockService.generateRentals.mockReturnValue({
      data: '',
      filename: 'rentals.csv',
      mimeType: 'text/csv',
    });
    const result = controller.generateRentals();
    expect(mockService.generateRentals).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
