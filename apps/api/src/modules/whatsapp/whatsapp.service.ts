import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  ping() {
    return { ok: true, module: 'whatsapp' };
  }
}
