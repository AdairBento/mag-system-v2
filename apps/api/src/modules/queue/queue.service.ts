import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  ping() {
    return { ok: true, module: 'queue' };
  }
}
