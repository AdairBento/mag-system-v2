import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  ping() {
    return { ok: true, module: 'pdf' };
  }
}
