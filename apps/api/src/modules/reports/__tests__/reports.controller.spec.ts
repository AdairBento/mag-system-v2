import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockService: any = {
    getDashboard: jest.fn(),
    getRentalReport: jest.fn(),
    getFleetReport: jest.fn(),
    getFinancialReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockService }],
    }).compile();
    controller = module.get<ReportsController>(ReportsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getDashboard should call service.getDashboard', async () => {
    mockService.getDashboard.mockResolvedValue({ totalClients: 0 });
    const result = await controller.getDashboard();
    expect(mockService.getDashboard).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('getFleetReport should call service.getFleetReport', async () => {
    mockService.getFleetReport.mockResolvedValue({ byStatus: [] });
    const result = await controller.getFleetReport();
    expect(mockService.getFleetReport).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
