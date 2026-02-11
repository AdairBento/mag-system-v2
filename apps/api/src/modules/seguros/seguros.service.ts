import { Injectable } from '@nestjs/common';

@Injectable()
export class SegurosService {
  ping() {
    return { ok: true, module: 'seguros' };
  }
}
