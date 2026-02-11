import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
