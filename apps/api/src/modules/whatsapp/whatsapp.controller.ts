import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('whatsapp')
@ApiBearerAuth()
@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send')
  @ApiOperation({ summary: 'Queue a WhatsApp message' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Message queued' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  send(@Body() dto: SendWhatsappDto) {
    return this.whatsappService.send(dto);
  }

  @Get('queue')
  @ApiOperation({ summary: 'Get pending WhatsApp queue' })
  @ApiResponse({ status: HttpStatus.OK, description: 'WhatsApp queue' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getQueue() {
    return this.whatsappService.getQueue();
  }

  @Get('queue/:jobId')
  @ApiOperation({ summary: 'Get WhatsApp job status' })
  @ApiParam({ name: 'jobId', description: 'Job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job status' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getJob(@Param('jobId') jobId: string) {
    return this.whatsappService.getJob(jobId);
  }
}
