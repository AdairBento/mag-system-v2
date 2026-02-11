import { Injectable } from '@nestjs/common';

@Injectable()
export class MaintenanceService {
  ping() {
    return { ok: true, module: 'maintenance' };
  }
}
