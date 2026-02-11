import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  ping() {
    return { ok: true, module: 'reports' };
  }
}
