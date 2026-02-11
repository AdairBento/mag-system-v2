import { Controller, Get } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private readonly service: ExcelService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
