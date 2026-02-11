import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  ping() {
    return { ok: true, module: 'notifications' };
  }
}
