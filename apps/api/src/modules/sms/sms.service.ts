import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  ping() {
    return { ok: true, module: 'sms' };
  }
}
