import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send should queue an email and return jobId', () => {
    const dto: any = {
      to: 'test@example.com',
      subject: 'Hello',
      template: 'Hello {{name}}',
      data: { name: 'World' },
    };
    const result = service.send(dto);
    expect(result.jobId).toBeDefined();
    expect(result.status).toBe('queued');
  });

  it('getQueue should return pending jobs', () => {
    service.send({ to: 'a@b.com', subject: 'Test', template: 'body' } as any);
    const queue = service.getQueue();
    expect(queue.length).toBeGreaterThan(0);
  });

  it('getJob should return the job by id', () => {
    const { jobId } = service.send({ to: 'a@b.com', subject: 'Test', template: 'body' } as any);
    const job = service.getJob(jobId);
    expect(job).toBeDefined();
    expect(job!.jobId).toBe(jobId);
  });
});
