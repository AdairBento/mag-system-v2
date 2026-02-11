import { Injectable } from '@nestjs/common';

@Injectable()
export class FinanceiroService {
  ping() {
    return { ok: true, module: 'financeiro' };
  }
}
