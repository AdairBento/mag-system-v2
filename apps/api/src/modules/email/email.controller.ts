import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('email')
@ApiBearerAuth()
@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Queue an email for sending' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Email queued' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  send(@Body() dto: SendEmailDto) {
    return this.emailService.send(dto);
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get pending email queue' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email queue' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getQueue() {
    return this.emailService.getQueue();
  }

  @Get('queue/:jobId')
  @ApiOperation({ summary: 'Get email job status' })
  @ApiParam({ name: 'jobId', description: 'Email job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job status' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getJob(@Param('jobId') jobId: string) {
    return this.emailService.getJob(jobId);
  }
}
