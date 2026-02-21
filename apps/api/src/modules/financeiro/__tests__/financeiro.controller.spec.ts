import { Test, TestingModule } from '@nestjs/testing';
import { FinanceiroController } from '../financeiro.controller';
import { FinanceiroService } from '../financeiro.service';

describe('FinanceiroController', () => {
  let controller: FinanceiroController;

  const mockService: any = {
    createInvoice: jest.fn(),
    findAllInvoices: jest.fn(),
    findOneInvoice: jest.fn(),
    updateInvoice: jest.fn(),
    removeInvoice: jest.fn(),
    createTransaction: jest.fn(),
    findAllTransactions: jest.fn(),
    findOneTransaction: jest.fn(),
    updateTransaction: jest.fn(),
    removeTransaction: jest.fn(),
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceiroController],
      providers: [{ provide: FinanceiroService, useValue: mockService }],
    }).compile();
    controller = module.get<FinanceiroController>(FinanceiroController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createInvoice should call service.createInvoice', async () => {
    mockService.createInvoice.mockResolvedValue({ id: '1' });
    const dto: any = {};
    const result = await controller.createInvoice(dto);
    expect(mockService.createInvoice).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });

  it('getSummary should call service.getSummary', async () => {
    mockService.getSummary.mockResolvedValue({
      totalIncome: 0,
      totalExpense: 0,
      pendingInvoices: 0,
    });
    const result = await controller.getSummary();
    expect(mockService.getSummary).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
