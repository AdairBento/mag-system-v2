import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  ping() {
    return { ok: true, module: 'storage' };
  }
}
