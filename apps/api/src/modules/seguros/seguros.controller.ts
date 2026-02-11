import { Controller, Get } from '@nestjs/common';
import { SegurosService } from './seguros.service';

@Controller('seguros')
export class SegurosController {
  constructor(private readonly service: SegurosService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
