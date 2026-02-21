import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from '../pdf.service';
import { PdfTemplate } from '../dto/generate-pdf.dto';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();
    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generate should return jobId and estimatedUrl', () => {
    const dto: any = { template: PdfTemplate.CONTRACT, resourceId: 'c1' };
    const result = service.generate(dto);
    expect(result.jobId).toBeDefined();
    expect(result.status).toBe('processing');
    expect(result.estimatedUrl).toContain(result.jobId);
  });

  it('getStatus should return job by jobId', () => {
    const { jobId } = service.generate({ template: PdfTemplate.INVOICE, resourceId: 'i1' });
    const job = service.getStatus(jobId);
    expect(job).toBeDefined();
    expect(job!.jobId).toBe(jobId);
  });
});
