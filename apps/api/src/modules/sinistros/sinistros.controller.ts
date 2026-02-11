import { Controller, Get } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';

@Controller('sinistros')
export class SinistrosController {
  constructor(private readonly service: SinistrosService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
