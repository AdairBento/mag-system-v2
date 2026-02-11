import { Controller, Get } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly service: SmsService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
