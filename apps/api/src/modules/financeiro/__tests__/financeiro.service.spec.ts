import { Test, TestingModule } from '@nestjs/testing';
import { FinanceiroService } from '../financeiro.service';
import { PrismaService } from '../../../database/prisma.service';

describe('FinanceiroService', () => {
  let service: FinanceiroService;

  const mockPrismaService: any = {
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceiroService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();
    service = module.get<FinanceiroService>(FinanceiroService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createInvoice should call prisma.invoice.create', async () => {
    const dto: any = {
      clientId: 'c1',
      invoiceNumber: 'INV-001',
      amount: 500,
      dueDate: '2024-02-01',
      description: 'Rental',
    };
    const expected: any = { id: '1', ...dto };
    mockPrismaService.invoice.create.mockResolvedValue(expected);
    const result = await service.createInvoice(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.invoice.create).toHaveBeenCalled();
  });

  it('createTransaction should call prisma.transaction.create', async () => {
    const dto: any = {
      type: 'INCOME',
      category: 'Rental',
      amount: 500,
      date: '2024-01-01',
      paymentMethod: 'PIX',
      description: 'Payment',
    };
    const expected: any = { id: 't1', ...dto };
    mockPrismaService.transaction.create.mockResolvedValue(expected);
    const result = await service.createTransaction(dto);
    expect(result).toEqual(expected);
    expect(mockPrismaService.transaction.create).toHaveBeenCalled();
  });

  it('getSummary should return income, expense, and pending invoices', async () => {
    mockPrismaService.transaction.aggregate
      .mockResolvedValueOnce({ _sum: { amount: 1000 } })
      .mockResolvedValueOnce({ _sum: { amount: 500 } });
    mockPrismaService.invoice.count.mockResolvedValue(3);
    const result = await service.getSummary();
    expect(result.totalIncome).toBe(1000);
    expect(result.totalExpense).toBe(500);
    expect(result.pendingInvoices).toBe(3);
  });
});
