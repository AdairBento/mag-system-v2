import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractsService {
  ping() {
    return { ok: true, module: 'contracts' };
  }
}
