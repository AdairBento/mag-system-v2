import { Injectable } from '@nestjs/common';

@Injectable()
export class SinistrosService {
  ping() {
    return { ok: true, module: 'sinistros' };
  }
}
