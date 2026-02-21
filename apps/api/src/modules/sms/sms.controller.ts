import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('sms')
@ApiBearerAuth()
@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Queue an SMS for sending' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'SMS queued' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Message too long' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  send(@Body() dto: SendSmsDto) {
    return this.smsService.send(dto);
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get pending SMS queue' })
  @ApiResponse({ status: HttpStatus.OK, description: 'SMS queue' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getQueue() {
    return this.smsService.getQueue();
  }

  @Get('queue/:jobId')
  @ApiOperation({ summary: 'Get SMS job status' })
  @ApiParam({ name: 'jobId', description: 'SMS job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job status' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getJob(@Param('jobId') jobId: string) {
    return this.smsService.getJob(jobId);
  }
}
