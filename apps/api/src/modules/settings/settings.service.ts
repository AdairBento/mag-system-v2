import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  ping() {
    return { ok: true, module: 'settings' };
  }
}
