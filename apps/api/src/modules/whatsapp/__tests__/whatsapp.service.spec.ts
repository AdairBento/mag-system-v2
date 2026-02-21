import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from '../whatsapp.service';

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsappService],
    }).compile();
    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send text message should return type text', () => {
    const result = service.send({ to: '+5511999999999', message: 'Hello' });
    expect(result.type).toBe('text');
    expect(result.status).toBe('queued');
  });

  it('send with templateName should return type template', () => {
    const result = service.send({
      to: '+5511999999999',
      templateName: 'welcome',
      templateParams: ['John'],
    });
    expect(result.type).toBe('template');
  });

  it('send with mediaUrl should return type media', () => {
    const result = service.send({ to: '+5511999999999', mediaUrl: 'http://example.com/photo.jpg' });
    expect(result.type).toBe('media');
  });
});
