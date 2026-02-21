import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from '../queue.controller';
import { QueueService } from '../queue.service';

describe('QueueController', () => {
  let controller: QueueController;

  const mockService: any = {
    enqueue: jest.fn(),
    listJobs: jest.fn(),
    getJob: jest.fn(),
    process: jest.fn(),
    cancelJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [{ provide: QueueService, useValue: mockService }],
    }).compile();
    controller = module.get<QueueController>(QueueController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('enqueue should call service.enqueue', () => {
    const job: any = { id: 'j1', status: 'PENDING' };
    mockService.enqueue.mockReturnValue(job);
    const dto: any = { name: 'test-job' };
    const result = controller.enqueue(dto);
    expect(mockService.enqueue).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('j1');
  });

  it('process should call service.process', () => {
    const job: any = { id: 'j1', status: 'COMPLETED' };
    mockService.process.mockReturnValue(job);
    const result = controller.process('j1');
    expect(mockService.process).toHaveBeenCalledWith('j1');
    expect(result.status).toBe('COMPLETED');
  });
});
