import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from '../sms.service';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();
    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send should queue an SMS and return jobId', () => {
    const dto: any = { to: '+5511999999999', message: 'Hello World' };
    const result = service.send(dto);
    expect(result.jobId).toBeDefined();
    expect(result.status).toBe('queued');
  });

  it('send should throw if message exceeds 160 chars', () => {
    const dto: any = { to: '+5511999999999', message: 'a'.repeat(161) };
    expect(() => service.send(dto)).toThrow();
  });

  it('getQueue should return queued jobs', () => {
    service.send({ to: '+5511999999999', message: 'Test' } as any);
    const queue = service.getQueue();
    expect(queue.length).toBeGreaterThan(0);
  });
});
