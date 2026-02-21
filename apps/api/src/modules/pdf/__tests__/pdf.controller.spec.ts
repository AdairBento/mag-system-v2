import { Test, TestingModule } from '@nestjs/testing';
import { PdfController } from '../pdf.controller';
import { PdfService } from '../pdf.service';

describe('PdfController', () => {
  let controller: PdfController;

  const mockService: any = {
    generate: jest.fn(),
    getStatus: jest.fn(),
    getContractPdf: jest.fn(),
    getInvoicePdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfController],
      providers: [{ provide: PdfService, useValue: mockService }],
    }).compile();
    controller = module.get<PdfController>(PdfController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('generate should call service.generate', () => {
    mockService.generate.mockReturnValue({
      jobId: 'j1',
      status: 'processing',
      estimatedUrl: '/pdf/files/j1.pdf',
    });
    const dto: any = { template: 'CONTRACT', resourceId: 'c1' };
    const result = controller.generate(dto);
    expect(mockService.generate).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });
});
