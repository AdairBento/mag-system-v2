import { Controller, Get } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly service: PdfService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
