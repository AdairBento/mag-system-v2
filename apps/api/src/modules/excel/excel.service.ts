import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelService {
  ping() {
    return { ok: true, module: 'excel' };
  }
}
