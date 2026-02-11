import { Controller, Get } from '@nestjs/common';
import { VistoriasService } from './vistorias.service';

@Controller('vistorias')
export class VistoriasController {
  constructor(private readonly service: VistoriasService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
