import { Controller, Get } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly service: QueueService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
