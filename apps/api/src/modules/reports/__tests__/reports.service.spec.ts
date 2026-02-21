import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { PrismaService } from '../../../database/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockPrismaService: any = {
    client: { count: jest.fn() },
    vehicle: { count: jest.fn(), groupBy: jest.fn(), aggregate: jest.fn() },
    rental: { count: jest.fn(), groupBy: jest.fn(), aggregate: jest.fn() },
    invoice: { count: jest.fn() },
    transaction: { aggregate: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getDashboard should return summary counts', async () => {
    mockPrismaService.client.count.mockResolvedValue(10);
    mockPrismaService.vehicle.count.mockResolvedValue(5);
    mockPrismaService.rental.count.mockResolvedValue(3);
    mockPrismaService.invoice.count.mockResolvedValue(2);
    const result = await service.getDashboard();
    expect(result.totalClients).toBe(10);
    expect(result.totalVehicles).toBe(5);
    expect(result.activeRentals).toBe(3);
    expect(result.pendingInvoices).toBe(2);
  });

  it('getFleetReport should return vehicle status breakdown', async () => {
    mockPrismaService.vehicle.groupBy.mockResolvedValue([
      { status: 'AVAILABLE', _count: { id: 4 } },
    ]);
    mockPrismaService.vehicle.aggregate.mockResolvedValue({ _avg: { dailyRate: 150 } });
    const result = await service.getFleetReport();
    expect(result.byStatus).toHaveLength(1);
    expect(result.avgDailyRate).toBe(150);
  });

  it('getFinancialReport should return income and expense totals', async () => {
    mockPrismaService.transaction.aggregate
      .mockResolvedValueOnce({ _sum: { amount: 5000 } })
      .mockResolvedValueOnce({ _sum: { amount: 2000 } });
    const result = await service.getFinancialReport({});
    expect(result.totalIncome).toBe(5000);
    expect(result.totalExpense).toBe(2000);
  });
});
