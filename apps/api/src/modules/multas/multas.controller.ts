import { Controller, Get } from '@nestjs/common';
import { MultasService } from './multas.service';

@Controller('multas')
export class MultasController {
  constructor(private readonly service: MultasService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
