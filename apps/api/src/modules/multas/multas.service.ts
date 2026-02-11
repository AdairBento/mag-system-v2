import { Injectable } from '@nestjs/common';

@Injectable()
export class MultasService {
  ping() {
    return { ok: true, module: 'multas' };
  }
}
