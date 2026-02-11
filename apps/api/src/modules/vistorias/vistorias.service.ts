import { Injectable } from '@nestjs/common';

@Injectable()
export class VistoriasService {
  ping() {
    return { ok: true, module: 'vistorias' };
  }
}
