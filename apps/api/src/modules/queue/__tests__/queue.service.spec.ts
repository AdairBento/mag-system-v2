import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../queue.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();
    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('enqueue should create a job with PENDING status', () => {
    const dto: any = { name: 'send-invoice', payload: { invoiceId: 'i1' } };
    const job = service.enqueue(dto);
    expect(job.id).toBeDefined();
    expect(job.status).toBe('PENDING');
    expect(job.name).toBe('send-invoice');
  });

  it('process should set job to COMPLETED', () => {
    const job = service.enqueue({ name: 'test-job' } as any);
    const processed = service.process(job.id);
    expect(processed.status).toBe('COMPLETED');
  });

  it('cancelJob should set job to CANCELLED', () => {
    const job = service.enqueue({ name: 'test-job' } as any);
    const cancelled = service.cancelJob(job.id);
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('listJobs should filter by status', () => {
    service.enqueue({ name: 'j1' } as any);
    service.enqueue({ name: 'j2' } as any);
    const pending = service.listJobs('PENDING');
    expect(pending.every((j) => j.status === 'PENDING')).toBe(true);
  });
});
