import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '../email.controller';
import { EmailService } from '../email.service';

describe('EmailController', () => {
  let controller: EmailController;

  const mockService: any = {
    send: jest.fn(),
    getQueue: jest.fn(),
    getJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [{ provide: EmailService, useValue: mockService }],
    }).compile();
    controller = module.get<EmailController>(EmailController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('send should call service.send', () => {
    mockService.send.mockReturnValue({ jobId: 'j1', status: 'queued' });
    const dto: any = { to: 'a@b.com', subject: 'Test', template: 'body' };
    const result = controller.send(dto);
    expect(mockService.send).toHaveBeenCalledWith(dto);
    expect(result.jobId).toBe('j1');
  });

  it('getQueue should call service.getQueue', () => {
    mockService.getQueue.mockReturnValue([]);
    const result = controller.getQueue();
    expect(mockService.getQueue).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
