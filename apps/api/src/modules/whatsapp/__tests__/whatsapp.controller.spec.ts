import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappController } from '../whatsapp.controller';
import { WhatsappService } from '../whatsapp.service';

describe('WhatsappController', () => {
  let controller: WhatsappController;

  const mockService: any = {
    send: jest.fn(),
    getQueue: jest.fn(),
    getJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappController],
      providers: [{ provide: WhatsappService, useValue: mockService }],
    }).compile();
    controller = module.get<WhatsappController>(WhatsappController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('send should call service.send', () => {
    mockService.send.mockReturnValue({ jobId: 'j1', type: 'text', status: 'queued' });
    const dto: any = { to: '+5511999999999', message: 'Hello' };
    const result = controller.send(dto);
    expect(mockService.send).toHaveBeenCalledWith(dto);
    expect(result).toBeDefined();
  });
});
