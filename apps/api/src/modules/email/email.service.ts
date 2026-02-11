import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  ping() {
    return { ok: true, module: 'email' };
  }
}
