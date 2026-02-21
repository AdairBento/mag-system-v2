import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('queue')
@ApiBearerAuth()
@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('jobs')
  @ApiOperation({ summary: 'Enqueue a new job' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Job enqueued' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  enqueue(@Body() dto: CreateJobDto) {
    return this.queueService.enqueue(dto);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List jobs, optionally filtered by status' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of jobs' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  listJobs(@Query('status') status?: any) {
    return this.queueService.listJobs(status);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get a job by ID' })
  @ApiParam({ name: 'id', description: 'Job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getJob(@Param('id') id: string) {
    return this.queueService.getJob(id);
  }

  @Post('jobs/:id/process')
  @ApiOperation({ summary: 'Process a job' })
  @ApiParam({ name: 'id', description: 'Job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job processed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  process(@Param('id') id: string) {
    return this.queueService.process(id);
  }

  @Delete('jobs/:id')
  @ApiOperation({ summary: 'Cancel a job' })
  @ApiParam({ name: 'id', description: 'Job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job cancelled' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  cancelJob(@Param('id') id: string) {
    return this.queueService.cancelJob(id);
  }
}
