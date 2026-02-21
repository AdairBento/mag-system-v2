import { Test, TestingModule } from '@nestjs/testing';
import { SmsController } from '../sms.controller';
import { SmsService } from '../sms.service';

describe('SmsController', () => {
  let controller: SmsController;

  const mockService: any = {
    send: jest.fn(),
    getQueue: jest.fn(),
    getJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmsController],
      providers: [{ provide: SmsService, useValue: mockService }],
    }).compile();
    controller = module.get<SmsController>(SmsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('send should call service.send', () => {
    mockService.send.mockReturnValue({ jobId: 'j1', status: 'queued' });
    const dto: any = { to: '+5511999999999', message: 'Hello' };
    const result = controller.send(dto);
    expect(mockService.send).toHaveBeenCalledWith(dto);
    expect(result.status).toBe('queued');
  });
});
