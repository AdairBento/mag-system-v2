import { Test, TestingModule } from '@nestjs/testing';
import { ExcelService } from '../excel.service';
import { ExcelReport } from '../dto/generate-excel.dto';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelService],
    }).compile();
    service = module.get<ExcelService>(ExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generate should return CSV data, filename, and mimeType', () => {
    const result = service.generate({ report: ExcelReport.RENTALS });
    expect(result.data).toBeDefined();
    expect(result.filename).toContain('rentals');
    expect(result.mimeType).toBe('text/csv');
  });

  it('getHeaders should return correct columns for each report type', () => {
    expect(service.getHeaders(ExcelReport.RENTALS)).toContain('id');
    expect(service.getHeaders(ExcelReport.FLEET)).toContain('plate');
    expect(service.getHeaders(ExcelReport.CLIENTS)).toContain('name');
  });
});
